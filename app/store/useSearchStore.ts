import { create } from "zustand";

interface SearchState {
  isOpen: boolean;
  query: string;
  recentSearches: string[];

  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;

  setQuery: (query: string) => void;
  addRecentSearch: (term: string) => void;
  clearRecentSearches: () => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  isOpen: false,
  query: "",
  recentSearches: ["Trench", "Spiky Hoodie", "Sterling Silver", "Cargo"],

  openSearch: () => set({ isOpen: true }),
  closeSearch: () => set({ isOpen: false, query: "" }),
  toggleSearch: () => set((state) => ({ isOpen: !state.isOpen, query: "" })),

  setQuery: (query) => set({ query }),

  addRecentSearch: (term) => {
    const clean = term.trim();
    if (!clean) return;
    const current = get().recentSearches;
    const updated = [clean, ...current.filter((item) => item.toLowerCase() !== clean.toLowerCase())].slice(0, 5);
    set({ recentSearches: updated });
  },

  clearRecentSearches: () => set({ recentSearches: [] })
}));
