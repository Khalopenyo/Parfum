import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { THEME } from "../data/theme";
import { PERFUMES, VOLUME_OPTIONS } from "../data/perfumes";
import { priceForVolume } from "../lib/scoring";

export default function PerfumePage() {
  const { id } = useParams();

  const perfume = useMemo(() => PERFUMES.find((p) => p.id === id), [id]);
  const [volume, setVolume] = React.useState(50);

  if (!perfume) {
    return (
      <div className="min-h-screen p-6" style={{ background: THEME.bg, color: THEME.text }}>
        <div className="mx-auto max-w-3xl">
          <div className="text-xl font-semibold">Аромат не найден</div>
          <Link to="/" className="mt-4 inline-block underline" style={{ color: THEME.muted2 }}>
            ← Вернуться в каталог
          </Link>
        </div>
      </div>
    );
  }

  const price = priceForVolume(perfume.price, volume, perfume.baseVolume);

  return (
    <div className="min-h-screen" style={{ background: THEME.bg, color: THEME.text }}>
      <div className="mx-auto max-w-4xl p-4 sm:p-6">
        <Link to="/" className="inline-block text-sm underline" style={{ color: THEME.muted2 }}>
          ← Вернуться в каталог
        </Link>

        <div className="mt-4 rounded-3xl border p-5" style={{ borderColor: THEME.border2, background: THEME.surface2 }}>
          <div className="flex flex-col gap-6 sm:flex-row">
            <div
              className="h-64 w-full overflow-hidden rounded-3xl border sm:h-72 sm:w-72"
              style={{ borderColor: THEME.border2, background: "rgba(255,255,255,0.02)" }}
            >
              <img src={perfume.image} alt={perfume.name} className="h-full w-full object-cover" />
            </div>

            <div className="flex-1">
              <div className="text-xs" style={{ color: THEME.muted }}>{perfume.brand}</div>
              <div className="mt-1 text-2xl font-semibold">{perfume.name}</div>
              <div className="mt-1 text-sm" style={{ color: THEME.muted }}>{perfume.family}</div>

              <div className="mt-4 text-sm" style={{ color: THEME.muted }}>
                {perfume.description}
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {perfume.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border px-3 py-1 text-xs"
                    style={{ borderColor: THEME.border2, background: "rgba(255,255,255,0.02)" }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex items-center gap-3">
                <div className="text-sm" style={{ color: THEME.muted }}>Объём</div>
                <select
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="rounded-2xl border bg-transparent px-3 py-2 text-sm outline-none"
                  style={{ borderColor: THEME.border2, color: THEME.text }}
                >
                  {VOLUME_OPTIONS.map((v) => (
                    <option key={v} value={v}>{v} мл</option>
                  ))}
                </select>

                <div className="ml-auto text-right">
                  <div className="text-xs" style={{ color: THEME.muted }}>Цена</div>
                  <div className="text-2xl font-semibold">{price}{perfume.currency}</div>
                  <div className="text-xs" style={{ color: THEME.muted2 }}>за {volume} мл</div>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border p-3" style={{ borderColor: THEME.border2 }}>
                  <div className="text-xs" style={{ color: THEME.muted }}>Сезоны</div>
                  <div className="mt-1 text-sm">{perfume.seasons.join(", ")}</div>
                </div>
                <div className="rounded-2xl border p-3" style={{ borderColor: THEME.border2 }}>
                  <div className="text-xs" style={{ color: THEME.muted }}>Время</div>
                  <div className="mt-1 text-sm">{perfume.dayNight.join(", ")}</div>
                </div>
                <div className="rounded-2xl border p-3" style={{ borderColor: THEME.border2 }}>
                  <div className="text-xs" style={{ color: THEME.muted }}>Пирамида</div>
                  <div className="mt-1 text-sm">{perfume.notes.top.length + perfume.notes.heart.length + perfume.notes.base.length} нот</div>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border p-3" style={{ borderColor: THEME.border2 }}>
                  <div className="text-xs font-semibold uppercase" style={{ color: THEME.muted2 }}>Верх</div>
                  <div className="mt-2 text-sm" style={{ color: THEME.muted }}>{perfume.notes.top.join(", ")}</div>
                </div>
                <div className="rounded-2xl border p-3" style={{ borderColor: THEME.border2 }}>
                  <div className="text-xs font-semibold uppercase" style={{ color: THEME.muted2 }}>Сердце</div>
                  <div className="mt-2 text-sm" style={{ color: THEME.muted }}>{perfume.notes.heart.join(", ")}</div>
                </div>
                <div className="rounded-2xl border p-3" style={{ borderColor: THEME.border2 }}>
                  <div className="text-xs font-semibold uppercase" style={{ color: THEME.muted2 }}>База</div>
                  <div className="mt-2 text-sm" style={{ color: THEME.muted }}>{perfume.notes.base.join(", ")}</div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  className="flex-1 rounded-full px-5 py-3 text-sm font-semibold"
                  style={{ background: THEME.accent, color: "#0B0B0F" }}
                  onClick={() => alert("Дальше подключим корзину")}
                >
                  Добавить в корзину ({volume} мл)
                </button>

                <button
                  type="button"
                  className="flex-1 rounded-full border px-5 py-3 text-sm"
                  style={{ borderColor: THEME.border2, color: THEME.text }}
                  onClick={() => alert("Дальше подключим избранное")}
                >
                  В избранное
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
