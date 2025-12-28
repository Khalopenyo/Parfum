import { create } from "zustand";

function readLS(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

const useShopStore = create((set) => ({
  cart: readLS("cart", []),
  favorites: readLS("favorites", []),

  addToCart: (id, volume, qty = 1) => {
    set((state) => {
      const idx = state.cart.findIndex((x) => x.id === id && x.volume === volume);
      if (idx !== -1) {
        const copy = [...state.cart];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty };
        return { cart: copy };
      }
      return { cart: [...state.cart, { id, volume, qty }] };
    });
  },

  removeFromCart: (id, volume) =>
    set((state) => ({ cart: state.cart.filter((x) => !(x.id === id && x.volume === volume)) })),

  setQty: (id, volume, qty) =>
    set((state) => ({
      cart: state.cart.map((x) =>
        x.id === id && x.volume === volume ? { ...x, qty: Math.max(1, qty) } : x
      ),
    })),

  toggleFavorite: (id) =>
    set((state) => ({
      favorites: state.favorites.includes(id)
        ? state.favorites.filter((x) => x !== id)
        : [...state.favorites, id],
    })),
}));

function persist(key, selector) {
  if (typeof window === "undefined") return;
  useShopStore.subscribe(selector, (value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  });
}

persist("cart", (state) => state.cart);
persist("favorites", (state) => state.favorites);

export { useShopStore };
