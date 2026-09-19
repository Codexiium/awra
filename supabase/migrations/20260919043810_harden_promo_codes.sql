-- SEC-5: promo_codes previously had no usage controls at all (no max_uses,
-- no per-user limit, no minimum order value, no start date) and allowed a
-- discount_percent up to 100 — a leaked or guessed 100% code was unlimited
-- free merchandise on a COD store. Adds the missing controls and caps the
-- discount at 50%. Enforcement happens in two places: lib/promo/actions.ts's
-- applyPromoCode is an apply-time UX check only (skippable by calling
-- place_order() directly with no prior "apply" call), so place_order() is
-- recreated here to actually enforce these at order time — the only check
-- that can't be bypassed.
begin;

alter table public.promo_codes
  add column max_uses int check (max_uses is null or max_uses > 0),
  add column times_used int not null default 0 check (times_used >= 0),
  add column min_order_total numeric(10,2) check (min_order_total is null or min_order_total >= 0),
  add column starts_at timestamptz;

alter table public.promo_codes drop constraint promo_codes_discount_percent_check;
alter table public.promo_codes add constraint promo_codes_discount_percent_check check (discount_percent between 1 and 50);

create or replace function public.place_order(
  p_shipping_address jsonb,
  p_phone text,
  p_promo_code text
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_cart_count int;
  v_row record;
  v_stock_qty int;
  v_subtotal numeric(10,2) := 0;
  v_promo record;
  v_discount_amount numeric(10,2) := 0;
  v_shipping_cost numeric(10,2);
  v_pretax numeric(10,2);
  v_gst_amount numeric(10,2);
  v_total numeric(10,2);
  v_order_id bigint;
  v_order_number text;
  v_promo_code text := nullif(upper(trim(coalesce(p_promo_code, ''))), '');
begin
  if v_user_id is null then
    raise exception 'not_authenticated';
  end if;

  select count(*) into v_cart_count from public.cart_items where user_id = v_user_id;
  if v_cart_count = 0 then
    raise exception 'empty_cart';
  end if;

  -- Pass 1: friendly early validation against current price/stock (not
  -- itself race-safe — pass 2 below is the actual guard).
  for v_row in
    select ci.product_id, ci.size, ci.quantity, p.name as product_name, p.price
    from public.cart_items ci
    join public.products p on p.id = ci.product_id
    where ci.user_id = v_user_id
  loop
    select stock_qty into v_stock_qty
    from public.product_variants
    where product_id = v_row.product_id and size = v_row.size and available;

    if v_stock_qty is null or v_stock_qty < v_row.quantity then
      raise exception 'insufficient_stock: % (size %)', v_row.product_name, v_row.size;
    end if;

    v_subtotal := v_subtotal + v_row.price * v_row.quantity;
  end loop;

  -- Pass 2: atomic conditional decrement — the real concurrency guard.
  for v_row in
    select product_id, size, quantity from public.cart_items where user_id = v_user_id
  loop
    update public.product_variants
    set stock_qty = stock_qty - v_row.quantity
    where product_id = v_row.product_id and size = v_row.size and stock_qty >= v_row.quantity;

    if not found then
      raise exception 'insufficient_stock';
    end if;
  end loop;

  if v_promo_code is not null then
    -- `for update` locks the matched row so two concurrent orders racing to
    -- use the last remaining use of a max_uses-limited code can't both
    -- succeed: the second caller's times_used read waits for the first's
    -- update to commit.
    select * into v_promo from public.promo_codes
    where code = v_promo_code
      and active
      and (expires_at is null or expires_at > now())
      and (starts_at is null or starts_at <= now())
      and (max_uses is null or times_used < max_uses)
      and (min_order_total is null or v_subtotal >= min_order_total)
    for update;

    if found then
      v_discount_amount := round(v_subtotal * v_promo.discount_percent / 100.0, 2);
      update public.promo_codes set times_used = times_used + 1 where id = v_promo.id;
    else
      -- Invalid/expired/exhausted/below-minimum: silently drop the code
      -- rather than failing the order — matches the pre-existing behavior
      -- where an unrecognized code just doesn't apply a discount.
      v_promo_code := null;
    end if;
  end if;

  v_shipping_cost := case when v_subtotal >= 250 then 0 else 25 end;
  v_pretax := greatest(0, v_subtotal - v_discount_amount + v_shipping_cost);
  v_gst_amount := round(v_pretax * 0.05, 2);
  v_total := v_pretax + v_gst_amount;

  insert into public.orders (
    user_id, subtotal, discount_amount, shipping_cost, gst_amount, total,
    promo_code, shipping_address, phone
  ) values (
    v_user_id, v_subtotal, v_discount_amount, v_shipping_cost, v_gst_amount, v_total,
    v_promo_code, p_shipping_address, p_phone
  )
  returning id, order_number into v_order_id, v_order_number;

  insert into public.order_items (order_id, product_id, product_name, size, unit_price, qty)
  select v_order_id, ci.product_id, p.name, ci.size, p.price, ci.quantity
  from public.cart_items ci
  join public.products p on p.id = ci.product_id
  where ci.user_id = v_user_id;

  insert into public.payments (order_id, provider, status, amount)
  values (v_order_id, 'cod', 'pending', v_total);

  delete from public.cart_items where user_id = v_user_id;

  return v_order_number;
end;
$$;

revoke all on function public.place_order(jsonb, text, text) from public, anon, authenticated;
grant execute on function public.place_order(jsonb, text, text) to authenticated;

commit;
