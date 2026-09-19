-- Adds orders.phone (COD is undeliverable without a contact number — see
-- TODO.md / AGENTS.md) and place_order(): a single atomic, security definer
-- function that replaces the multi-step sequence previously performed by
-- lib/checkout/actions.ts directly against the authenticated client.
--
-- Why this exists (three findings closed by one change):
--   1. The old flow decremented stock with `update ... set stock_qty =
--      <value computed from an earlier read>` — a classic read-modify-write
--      race: two concurrent checkouts on the last unit could both read
--      stock_qty = 1, both pass validation, and both write 0. This function's
--      decrement instead does `set stock_qty = stock_qty - qty where
--      stock_qty >= qty`, checked via row count, so a losing concurrent
--      caller gets zero rows affected and the whole order aborts.
--   2. The old flow was five sequential, non-transactional writes (orders
--      insert, order_items insert, per-variant stock decrements, cart clear,
--      payments insert). Any failure partway left inconsistent state. A
--      Postgres function's body is one transaction — any exception rolls
--      back everything it did, with nothing left half-done.
--   3. Authenticated users previously held `insert` on orders/order_items/
--      payments directly (see the grants migration alongside this one, which
--      revokes that) — meaning a client could forge an order with a fake
--      total and a `payments` row claiming `status = 'succeeded'`, entirely
--      bypassing this validation. This function is now the only path in.
--
-- Pricing here must stay in sync with the client-side display copy in
-- app/store/useCartStore.ts (free shipping at subtotal >= 250, else a flat
-- 25; GST 5% of subtotal - discount + shipping) — that copy is display-only
-- and cannot affect the charged total, but a drift would show the customer
-- one number and charge them another.
begin;

alter table public.orders add column phone text;

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
  v_discount_percent int;
  v_discount_amount numeric(10,2);
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

  -- Pass 1: friendly early validation against current price/stock. Not
  -- itself race-safe (nothing here holds a lock) — pass 2 below is what
  -- actually closes the race; this pass just avoids doing any writes at all
  -- for the common "someone already bought the last one" case.
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

  -- Pass 2: atomic conditional decrement. `stock_qty >= quantity` is
  -- re-checked at write time under the row's own update lock — this is the
  -- actual concurrency guard, not pass 1.
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
    select discount_percent into v_discount_percent
    from public.promo_codes
    where code = v_promo_code and active and (expires_at is null or expires_at > now());
  end if;
  v_discount_amount := round(v_subtotal * coalesce(v_discount_percent, 0) / 100.0, 2);

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

  -- Cash on Delivery is the only provider today, so the payments row is
  -- created directly here rather than via a separate provider call — see
  -- lib/payments/providers/cod.ts, which now only builds the redirect URL.
  insert into public.payments (order_id, provider, status, amount)
  values (v_order_id, 'cod', 'pending', v_total);

  delete from public.cart_items where user_id = v_user_id;

  return v_order_number;
end;
$$;

revoke all on function public.place_order(jsonb, text, text) from public, anon, authenticated;
grant execute on function public.place_order(jsonb, text, text) to authenticated;

commit;
