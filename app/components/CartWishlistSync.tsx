"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@/lib/supabase/useUser";
import { useCartStore } from "@/app/store/useCartStore";
import { useWishlistStore } from "@/app/store/useWishlistStore";
import { createClient } from "@/lib/supabase/client";
import type { CartItem, Product } from "@/app/types";

// Runs whenever a session is present (fresh login, or a page load that's
// already authenticated): merges anything held locally (from browsing as a
// guest) into the server tables, then re-fetches the server's copy and makes
// it the local state going forward, so cross-device/session data wins.
export default function CartWishlistSync() {
  const { user, loading } = useUser();
  const syncedForUserId = useRef<string | null>(null);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      // A previously-synced user just logged out: their cart/wishlist must not
      // leak to whichever guest uses this browser next.
      if (syncedForUserId.current !== null) {
        useCartStore.getState().hydrateCart([]);
        useWishlistStore.getState().hydrateWishlist([]);
        syncedForUserId.current = null;
      }
      return;
    }

    if (syncedForUserId.current === user.id) return;
    syncedForUserId.current = user.id;

    const { cart } = useCartStore.getState();
    const { wishlist } = useWishlistStore.getState();

    (async () => {
      const supabase = createClient();

      if (cart.length > 0) {
        const rows = cart.map((item) => ({
          user_id: user.id,
          product_id: Number(item.product.id),
          size: item.selectedSize,
          color_name: item.selectedColor,
          quantity: item.quantity
        }));
        await supabase.from("cart_items").upsert(rows, { onConflict: "user_id,product_id,size,color_name" });
      }

      if (wishlist.length > 0) {
        const rows = wishlist.map((p) => ({ user_id: user.id, product_id: Number(p.id) }));
        await supabase.from("wishlists").upsert(rows, { onConflict: "user_id,product_id", ignoreDuplicates: true });
      }

      const [cartRes, wishlistRes] = await Promise.all([fetch("/api/cart"), fetch("/api/wishlist")]);
      const cartData: { items: CartItem[] } = await cartRes.json();
      const wishlistData: { products: Product[] } = await wishlistRes.json();

      useCartStore.getState().hydrateCart(cartData.items);
      useWishlistStore.getState().hydrateWishlist(wishlistData.products);
    })();
  }, [user, loading]);

  return null;
}
