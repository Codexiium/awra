import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product, PromoResult } from "@/app/types";

interface CartState {
  cart: CartItem[];
  isOpen: boolean;
  promoCode: string;
  discountPercent: number;
  toastMessage: string | null;

  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  addItem: (product: Product, selectedSize?: string, selectedColor?: string, quantity?: number) => void;
  removeItem: (productId: string, selectedSize: string, selectedColor: string) => void;
  updateQuantity: (productId: string, selectedSize: string, selectedColor: string, newQty: number) => void;
  applyPromoCode: (code: string) => PromoResult;
  clearCart: () => void;
  clearToast: () => void;

  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getShippingCost: () => number;
  getGrandTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      isOpen: false,
      promoCode: "",
      discountPercent: 0,
      toastMessage: null,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (product, selectedSize = "M", selectedColor = "Obsidian Black", quantity = 1) => {
        const currentCart = get().cart;
        const existingIndex = currentCart.findIndex(
          (item) => item.product.id === product.id && item.selectedSize === selectedSize && item.selectedColor === selectedColor
        );

        let newCart: CartItem[];
        if (existingIndex > -1) {
          newCart = [...currentCart];
          newCart[existingIndex] = {
            ...newCart[existingIndex],
            quantity: newCart[existingIndex].quantity + quantity
          };
        } else {
          newCart = [...currentCart, { product, selectedSize, selectedColor, quantity }];
        }

        set({
          cart: newCart,
          isOpen: true,
          toastMessage: `Added ${product.name} to bag`
        });
      },

      removeItem: (productId, selectedSize, selectedColor) => {
        const newCart = get().cart.filter(
          (item) => !(item.product.id === productId && item.selectedSize === selectedSize && item.selectedColor === selectedColor)
        );
        set({ cart: newCart, toastMessage: "Item removed from bag" });
      },

      updateQuantity: (productId, selectedSize, selectedColor, newQty) => {
        if (newQty <= 0) {
          get().removeItem(productId, selectedSize, selectedColor);
          return;
        }
        const newCart = get().cart.map((item) => {
          if (item.product.id === productId && item.selectedSize === selectedSize && item.selectedColor === selectedColor) {
            return { ...item, quantity: newQty };
          }
          return item;
        });
        set({ cart: newCart });
      },

      applyPromoCode: (code) => {
        const clean = code.trim().toUpperCase();
        if (clean === "ARWA15" || clean === "GOTHIC15") {
          set({ promoCode: clean, discountPercent: 15, toastMessage: "15% Gothic Discount Applied!" });
          return { success: true, message: "15% promo code applied" };
        } else if (clean === "DARK20") {
          set({ promoCode: clean, discountPercent: 20, toastMessage: "20% Nocturnal Discount Applied!" });
          return { success: true, message: "20% promo code applied" };
        }
        return { success: false, message: "Invalid promo code. Try ARWA15" };
      },

      clearCart: () => set({ cart: [], promoCode: "", discountPercent: 0 }),

      clearToast: () => set({ toastMessage: null }),

      getSubtotal: () => {
        return get().cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
      },

      getDiscountAmount: () => {
        const subtotal = get().getSubtotal();
        return (subtotal * get().discountPercent) / 100;
      },

      getShippingCost: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        return subtotal >= 250 ? 0 : 25;
      },

      getGrandTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscountAmount();
        const shipping = get().getShippingCost();
        return Math.max(0, subtotal - discount + shipping);
      }
    }),
    {
      name: "arwa-cart-storage"
    }
  )
);
