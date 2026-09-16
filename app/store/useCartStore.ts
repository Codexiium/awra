import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product, PromoResult } from "@/app/types";
import { syncUpsertCartItem, syncRemoveCartItem, syncClearCart } from "@/lib/supabase/sync";
import { applyPromoCode as applyPromoCodeAction } from "@/lib/promo/actions";

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
  applyPromoCode: (code: string) => Promise<PromoResult>;
  clearCart: () => void;
  clearToast: () => void;
  hydrateCart: (items: CartItem[]) => void;

  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getShippingCost: () => number;
  getGstAmount: () => number;
  getGrandTotal: () => number;
}

const GST_RATE = 0.05;

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
        let newQuantity: number;
        if (existingIndex > -1) {
          newCart = [...currentCart];
          newQuantity = newCart[existingIndex].quantity + quantity;
          newCart[existingIndex] = { ...newCart[existingIndex], quantity: newQuantity };
        } else {
          newCart = [...currentCart, { product, selectedSize, selectedColor, quantity }];
          newQuantity = quantity;
        }

        set({
          cart: newCart,
          isOpen: true,
          toastMessage: `Added ${product.name} to bag`
        });
        syncUpsertCartItem(product.id, selectedSize, selectedColor, newQuantity);
      },

      removeItem: (productId, selectedSize, selectedColor) => {
        const newCart = get().cart.filter(
          (item) => !(item.product.id === productId && item.selectedSize === selectedSize && item.selectedColor === selectedColor)
        );
        set({ cart: newCart, toastMessage: "Item removed from bag" });
        syncRemoveCartItem(productId, selectedSize, selectedColor);
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
        syncUpsertCartItem(productId, selectedSize, selectedColor, newQty);
      },

      applyPromoCode: async (code) => {
        const result = await applyPromoCodeAction(code);
        if (result.success) {
          set({
            promoCode: code.trim().toUpperCase(),
            discountPercent: result.discountPercent,
            toastMessage: result.message
          });
        }
        return { success: result.success, message: result.message };
      },

      clearCart: () => {
        set({ cart: [], promoCode: "", discountPercent: 0 });
        syncClearCart();
      },

      clearToast: () => set({ toastMessage: null }),

      hydrateCart: (items) => set({ cart: items }),

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

      getGstAmount: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscountAmount();
        const shipping = get().getShippingCost();
        const preTaxTotal = Math.max(0, subtotal - discount + shipping);
        return Math.round(preTaxTotal * GST_RATE * 100) / 100;
      },

      getGrandTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscountAmount();
        const shipping = get().getShippingCost();
        const preTaxTotal = Math.max(0, subtotal - discount + shipping);
        return preTaxTotal + get().getGstAmount();
      }
    }),
    {
      name: "arwa-cart-storage"
    }
  )
);
