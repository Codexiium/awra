import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product, PromoResult } from "@/app/types";
import { syncUpsertCartItem, syncRemoveCartItem, syncClearCart } from "@/lib/supabase/sync";
import { applyPromoCode as applyPromoCodeAction } from "@/lib/promo/actions";
import { FREE_SHIPPING_THRESHOLD_INR, FLAT_SHIPPING_COST_INR } from "@/lib/pricing/shipping";

interface CartState {
  cart: CartItem[];
  isOpen: boolean;
  promoCode: string;
  discountPercent: number;
  toastMessage: string | null;

  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  addItem: (product: Product, selectedSize?: string, quantity?: number) => void;
  removeItem: (productId: string, selectedSize: string) => void;
  updateQuantity: (productId: string, selectedSize: string, newQty: number) => void;
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

      addItem: (product, selectedSize = "M", quantity = 1) => {
        const currentCart = get().cart;
        const existingIndex = currentCart.findIndex(
          (item) => item.product.id === product.id && item.selectedSize === selectedSize
        );

        let newCart: CartItem[];
        let newQuantity: number;
        if (existingIndex > -1) {
          newCart = [...currentCart];
          newQuantity = newCart[existingIndex].quantity + quantity;
          newCart[existingIndex] = { ...newCart[existingIndex], quantity: newQuantity };
        } else {
          newCart = [...currentCart, { product, selectedSize, quantity }];
          newQuantity = quantity;
        }

        set({
          cart: newCart,
          isOpen: true,
          toastMessage: `Added ${product.name} to bag`
        });
        syncUpsertCartItem(product.id, selectedSize, newQuantity);
      },

      removeItem: (productId, selectedSize) => {
        const newCart = get().cart.filter((item) => !(item.product.id === productId && item.selectedSize === selectedSize));
        set({ cart: newCart, toastMessage: "Item removed from bag" });
        syncRemoveCartItem(productId, selectedSize);
      },

      updateQuantity: (productId, selectedSize, newQty) => {
        if (newQty <= 0) {
          get().removeItem(productId, selectedSize);
          return;
        }
        const newCart = get().cart.map((item) => {
          if (item.product.id === productId && item.selectedSize === selectedSize) {
            return { ...item, quantity: newQty };
          }
          return item;
        });
        set({ cart: newCart });
        syncUpsertCartItem(productId, selectedSize, newQty);
      },

      applyPromoCode: async (code) => {
        const result = await applyPromoCodeAction(code, get().getSubtotal());
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
        return subtotal >= FREE_SHIPPING_THRESHOLD_INR ? 0 : FLAT_SHIPPING_COST_INR;
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
