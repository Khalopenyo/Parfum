import React from "react";
import { Search, SlidersHorizontal, X, Heart } from "lucide-react";
import { THEME } from "../data/theme";
import { plural } from "../lib/utils";

export default function CatalogToolbar({
  q,
  onChangeQ,
  onClearQ,
  sort,
  onChangeSort,
  total,
  favoritesCount,
  onClearAll,
  onOpenFilters,
}) {
  return (
    <div className="rounded-3xl border p-4" style={{ borderColor: THEME.border2, background: THEME.surface2 }}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2"
            style={{ color: THEME.muted2 }}
          />
          <input
            value={q}
            onChange={(e) => onChangeQ(e.target.value)}
            className="w-full rounded-2xl border bg-transparent px-11 py-3 text-sm outline-none focus:ring-2 focus:ring-[rgba(127,122,73,0.40)]"
            style={{ borderColor: THEME.border2, color: THEME.text }}
            placeholder="Поиск по бренду, названию, нотам..."
          />
          {q ? (
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 hover:bg-white/10"
              onClick={onClearQ}
              aria-label="Очистить поиск"
            >
              <X className="h-4 w-4" style={{ color: THEME.muted }} />
            </button>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs" style={{ color: THEME.muted }}>
            Сортировка
          </label>
          <select
            value={sort}
            onChange={(e) => onChangeSort(e.target.value)}
            className="rounded-2xl border bg-transparent px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[rgba(127,122,73,0.40)]"
            style={{ borderColor: THEME.border2, color: THEME.text }}
          >
            <option value="match">По совпадению</option>
            <option value="price_asc">Цена: ↑</option>
            <option value="price_desc">Цена: ↓</option>
            <option value="longevity">Стойкость</option>
            <option value="sillage">Шлейф</option>
          </select>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm transition hover:bg-white/[0.06] md:hidden"
            style={{ borderColor: THEME.border2, color: THEME.text }}
            onClick={onOpenFilters}
          >
            <SlidersHorizontal className="h-4 w-4" style={{ color: THEME.muted }} />
            Фильтры
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full border px-3 py-1.5 text-sm" style={{ borderColor: THEME.border2, color: THEME.text }}>
          {total} {plural(total, "вариант", "варианта", "вариантов")}
        </span>

        {favoritesCount ? (
          <span className="rounded-full border px-3 py-1.5 text-sm" style={{ borderColor: THEME.border2, color: THEME.text }}>
            <Heart className="mr-2 inline-block h-4 w-4" style={{ color: THEME.accent }} />
            {favoritesCount} {plural(favoritesCount, "избранный", "избранных", "избранных")}
          </span>
        ) : null}

        <button
          type="button"
          className="ml-auto rounded-full border px-4 py-1.5 text-sm transition hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-[rgba(127,122,73,0.40)]"
          style={{ borderColor: THEME.border2, color: THEME.text }}
          onClick={onClearAll}
        >
          Сбросить
        </button>
      </div>
    </div>
  );
}
