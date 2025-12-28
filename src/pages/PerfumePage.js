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
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="inline-flex items-center text-sm underline" style={{ color: THEME.muted2 }}>
            ← Вернуться в каталог
          </Link>
          <span className="text-xs" style={{ color: THEME.muted2 }}>
            {perfume.brand}
          </span>
        </div>

        <div className="rounded-3xl border p-5 shadow-2xl sm:p-8" style={{ borderColor: THEME.border2, background: THEME.surface2 }}>
          <div className="grid gap-6 lg:grid-cols-[320px,1fr] lg:items-start">
            <div className="mx-auto w-full max-w-xs overflow-hidden rounded-3xl border" style={{ borderColor: THEME.border2, background: "rgba(255,255,255,0.02)" }}>
              <img src={perfume.image} alt={perfume.name} className="h-full w-full object-cover" />
            </div>

            <div className="space-y-5">
              <div>
                <div className="text-sm uppercase tracking-[0.08em]" style={{ color: THEME.muted2 }}>
                  {perfume.family}
                </div>
                <h1 className="mt-1 text-3xl font-semibold leading-tight">{perfume.name}</h1>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: THEME.muted }}>
                  {perfume.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
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

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border p-3" style={{ borderColor: THEME.border2 }}>
                  <div className="text-xs" style={{ color: THEME.muted }}>Сезоны</div>
                  <div className="mt-1 text-sm" style={{ color: THEME.text }}>{perfume.seasons.join(", ")}</div>
                </div>
                <div className="rounded-2xl border p-3" style={{ borderColor: THEME.border2 }}>
                  <div className="text-xs" style={{ color: THEME.muted }}>Время</div>
                  <div className="mt-1 text-sm" style={{ color: THEME.text }}>{perfume.dayNight.join(", ")}</div>
                </div>
                <div className="rounded-2xl border p-3" style={{ borderColor: THEME.border2 }}>
                  <div className="text-xs" style={{ color: THEME.muted }}>Пирамида</div>
                  <div className="mt-1 text-sm" style={{ color: THEME.text }}>{perfume.notes.top.length + perfume.notes.heart.length + perfume.notes.base.length} нот</div>
                </div>
              </div>

              <div className="rounded-2xl border p-4" style={{ borderColor: THEME.border2, background: "rgba(255,255,255,0.02)" }}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-sm" style={{ color: THEME.muted }}>Объём</span>
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
                  </div>

                  <div className="sm:ml-auto text-left sm:text-right">
                    <div className="text-xs" style={{ color: THEME.muted }}>Цена</div>
                    <div className="text-3xl font-semibold leading-tight">{price}{perfume.currency}</div>
                    <div className="text-xs" style={{ color: THEME.muted2 }}>за {volume} мл</div>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <NoteBlock title="Верх" notes={perfume.notes.top} />
                <NoteBlock title="Сердце" notes={perfume.notes.heart} />
                <NoteBlock title="База" notes={perfume.notes.base} />
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
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

function NoteBlock({ title, notes }) {
  return (
    <div className="rounded-2xl border p-3" style={{ borderColor: THEME.border2 }}>
      <div className="text-xs font-semibold uppercase tracking-[0.08em]" style={{ color: THEME.muted2 }}>
        {title}
      </div>
      <div className="mt-2 text-sm leading-relaxed" style={{ color: THEME.muted }}>
        {notes.join(", ")}
      </div>
    </div>
  );
}
