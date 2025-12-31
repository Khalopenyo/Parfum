import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import CatalogPage from "../pages/CatalogPage";
import PerfumePage from "../pages/PerfumePage";
import CartPage from "../pages/CartPage";
import FavoritesPage from "../pages/FavoritesPage";

import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { auth } from '../firebase/firebase'; // важно: относительный путь

export default function App() {
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        await signInAnonymously(auth);
      }
    });
    return () => unsub();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<CatalogPage />} />
      <Route path="/perfumes/:id" element={<PerfumePage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/favorites" element={<FavoritesPage />} />
    </Routes>
  );
}
