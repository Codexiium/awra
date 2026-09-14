import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/app/types";
import { syncAddWishlistItem, syncRemoveWishlistItem } from "@/lib/supabase/sync";

interface WishlistState {
  wishlist: Product[];
  toastMessage: string | null;

  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  clearToast: () => void;
  hydrateWishlist: (products: Product[]) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlist: [],
      toastMessage: null,

      toggleWishlist: (product) => {
        const current = get().wishlist;
        const exists = current.some((item) => item.id === product.id);

        if (exists) {
          set({
            wishlist: current.filter((item) => item.id !== product.id),
            toastMessage: `Removed ${product.name} from wishlist`
          });
          syncRemoveWishlistItem(product.id);
        } else {
          set({
            wishlist: [...current, product],
            toastMessage: `Saved ${product.name} to wishlist`
          });
          syncAddWishlistItem(product.id);
        }
      },

      isInWishlist: (productId) => {
        return get().wishlist.some((item) => item.id === productId);
      },

      clearWishlist: () => set({ wishlist: [] }),
      clearToast: () => set({ toastMessage: null }),

      hydrateWishlist: (products) => set({ wishlist: products })
    }),
    {
      name: "arwa-wishlist-storage"
    }
  )
);
