import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const ShopContext = createContext(null);

function readLS(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function ShopProvider({ children }) {
  const [cart, setCart] = useState(() => readLS("cart", [])); // [{id, volume, qty}]
  const [favorites, setFavorites] = useState(() => readLS("favorites", [])); // [id]

  useEffect(() => localStorage.setItem("cart", JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem("favorites", JSON.stringify(favorites)), [favorites]);

  const api = useMemo(() => {
    const addToCart = (id, volume, qty = 1) => {
      setCart((prev) => {
        const idx = prev.findIndex((x) => x.id === id && x.volume === volume);
        if (idx !== -1) {
          const copy = [...prev];
          copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty };
          return copy;
        }
        return [...prev, { id, volume, qty }];
      });
    };

    const removeFromCart = (id, volume) =>
      setCart((prev) => prev.filter((x) => !(x.id === id && x.volume === volume)));

    const setQty = (id, volume, qty) =>
      setCart((prev) =>
        prev.map((x) => (x.id === id && x.volume === volume ? { ...x, qty: Math.max(1, qty) } : x))
      );

    const toggleFavorite = (id) =>
      setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

    return { cart, favorites, addToCart, removeFromCart, setQty, toggleFavorite };
  }, [cart, favorites]);

  return <ShopContext.Provider value={api}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used inside <ShopProvider>");
  return ctx;
}
