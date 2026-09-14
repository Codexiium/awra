"use client";

import { createClient } from "./client";

// Best-effort, fire-and-forget writes to the logged-in user's server-persisted
// cart/wishlist. Called alongside every zustand store mutation. Guests (no
// session) are silently skipped — the store's local/localStorage state is the
// only copy in that case, unchanged from before this sync layer existed.

async function getCurrentUserId(): Promise<string | null> {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

export async function syncUpsertCartItem(productId: string, size: string, colorName: string, quantity: number) {
  const userId = await getCurrentUserId();
  if (!userId) return;
  const supabase = createClient();
  await supabase
    .from("cart_items")
    .upsert(
      { user_id: userId, product_id: Number(productId), size, color_name: colorName, quantity },
      { onConflict: "user_id,product_id,size,color_name" }
    );
}

export async function syncRemoveCartItem(productId: string, size: string, colorName: string) {
  const userId = await getCurrentUserId();
  if (!userId) return;
  const supabase = createClient();
  await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", Number(productId))
    .eq("size", size)
    .eq("color_name", colorName);
}

export async function syncClearCart() {
  const userId = await getCurrentUserId();
  if (!userId) return;
  const supabase = createClient();
  await supabase.from("cart_items").delete().eq("user_id", userId);
}

export async function syncAddWishlistItem(productId: string) {
  const userId = await getCurrentUserId();
  if (!userId) return;
  const supabase = createClient();
  await supabase
    .from("wishlists")
    .upsert({ user_id: userId, product_id: Number(productId) }, { onConflict: "user_id,product_id", ignoreDuplicates: true });
}

export async function syncRemoveWishlistItem(productId: string) {
  const userId = await getCurrentUserId();
  if (!userId) return;
  const supabase = createClient();
  await supabase.from("wishlists").delete().eq("user_id", userId).eq("product_id", Number(productId));
}
