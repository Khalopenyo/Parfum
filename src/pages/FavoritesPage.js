import React, { useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useShop } from "../state/shop";
import { PERFUMES } from "../data/perfumes";
import { THEME } from "../data/theme";
import PerfumeCard from "../components/PerfumeCard";

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { favorites, toggleFavorite, addToCart } = useShop();

  // Находим парфюмы по ID из избранного
  const favPerfumes = useMemo(() => {
    return PERFUMES.filter((p) => favorites.includes(p.id));
  }, [favorites]);

  return (
    <main
      className="min-h-screen px-4 py-8"
      style={{ background: THEME.bg, color: THEME.text }}
    >
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Избранное</h1>
          <p className="text-sm mt-1" style={{ color: THEME.muted }}>
            Сохраняй ароматы, чтобы вернуться к ним позже
          </p>
        </div>

        <Link
          to="/"
          className="rounded-full border px-4 py-2 text-sm hover:bg-white/[0.06]"
          style={{ borderColor: THEME.border2, color: THEME.text }}
        >
          ← В каталог
        </Link>
      </header>

      {favPerfumes.length === 0 ? (
        <div
          className="mt-10 rounded-3xl border p-6 text-center"
          style={{ borderColor: THEME.border2, background: THEME.surface2 }}
        >
          <div className="text-lg font-semibold">Нет избранных ароматов</div>
          <p className="mt-2 text-sm" style={{ color: THEME.muted }}>
            Добавь понравившиеся ароматы из каталога 💎
          </p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {favPerfumes.map((perfume) => (
            <PerfumeCard
              key={perfume.id}
              perfume={perfume}
              score={0}
              liked={true}
              volume={perfume.baseVolume}
              onVolumeChange={() => {}}
              onLike={() => toggleFavorite(perfume.id)}
              onDetails={() => navigate(`/perfumes/${perfume.id}`)}
              onAddToCart={() => addToCart(perfume.id, perfume.baseVolume, 1)}
            />
          ))}
        </div>
      )}

      <footer
        className="mt-10 border-t pt-6 text-xs"
        style={{ borderColor: THEME.border2, color: THEME.muted2 }}
      >
        © {new Date().getFullYear()} Aroma Atelier
      </footer>
    </main>
  );
}
