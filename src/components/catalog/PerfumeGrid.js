import React from "react";
import { AnimatePresence } from "framer-motion";
import PerfumeCard from "../PerfumeCard";
import { priceForVolume } from "../../lib/scoring";

export default function PerfumeGrid({ items, favorites, getVolume, setVolume, onLike, onDetails, onAddToCart }) {
  return (
    <div className="mt-5 grid gap-4 lg:grid-cols-2">
      <AnimatePresence>
        {items.map(({ perfume, score }) => (
          <PerfumeCard
            key={perfume.id}
            perfume={perfume}
            score={score}
            liked={favorites.includes(perfume.id)}
            volume={getVolume(perfume.id)}
            onVolumeChange={(v) => setVolume(perfume.id, v)}
            onLike={() => onLike(perfume.id)}
            onDetails={() => onDetails(perfume.id)}
            onAddToCart={() => onAddToCart(perfume)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

export function getActivePrice(perfume, volume) {
  return priceForVolume(perfume.price, volume, perfume.baseVolume);
}
