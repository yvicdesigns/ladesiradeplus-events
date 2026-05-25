import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Article } from "@/lib/supabase/types";

export interface CartItem {
  article: Article;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (article: Article, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (article, quantity = 1) => {
        const items = get().items;
        const existing = items.find((i) => i.article.id === article.id);
        if (existing) {
          set({
            items: items.map((i) =>
              i.article.id === article.id
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          });
        } else {
          set({ items: [...items, { article, quantity }] });
        }
      },

      removeItem: (id) =>
        set({ items: get().items.filter((i) => i.article.id !== id) }),

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.article.id === id ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),
      toggleCart: () => set({ isOpen: !get().isOpen }),

      getTotalItems: () =>
        get().items.reduce((acc, i) => acc + i.quantity, 0),

      getTotalPrice: () =>
        get().items.reduce(
          (acc, i) => acc + i.article.price_per_day * i.quantity,
          0
        ),
    }),
    { name: "desirade-cart" }
  )
);
