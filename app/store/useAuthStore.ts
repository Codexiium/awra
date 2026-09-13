import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "@/app/types";

interface AuthState {
  isLoggedIn: boolean;
  user: AuthUser;
  login: (email?: string, password?: string) => void;
  logout: () => void;
  toggleAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLoggedIn: true,
      user: {
        id: "usr-889",
        name: "Maelis Vane",
        email: "maelis.vane@arwawear.com",
        phone: "+1 (555) 019-2834",
        memberSince: "OCT 2024",
        tier: "Nocturnal VIP Member",
        shippingAddress: {
          street: "742 Gothic Arch Avenue",
          city: "New York",
          state: "NY",
          postalCode: "10012",
          country: "United States"
        },
        orders: [
          {
            id: "ARWA-98412",
            date: "2026-08-28",
            status: "Delivered",
            total: 680,
            items: [
              { name: "CATHEDRAL OVERSIZED TRENCH", size: "L", price: 680, qty: 1 }
            ]
          },
          {
            id: "ARWA-87201",
            date: "2026-07-14",
            status: "In Transit",
            total: 550,
            items: [
              { name: "NOCTURNAL SPIKY HEAVY HOODIE", size: "M", price: 340, qty: 1 },
              { name: "GOTHIC SPIKY PENDANT NECKLACE", size: "One Size", price: 210, qty: 1 }
            ]
          }
        ]
      },

      login: (email) => {
        set({
          isLoggedIn: true,
          user: {
            ...get().user,
            email: email || get().user.email
          }
        });
      },

      logout: () => {
        set({ isLoggedIn: false });
      },

      toggleAuth: () => {
        set((state) => ({ isLoggedIn: !state.isLoggedIn }));
      }
    }),
    {
      name: "arwa-auth-storage"
    }
  )
);
