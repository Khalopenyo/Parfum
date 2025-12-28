import React from "react";
import Modal from "../../ui/Modal";
import Dots from "../../ui/Dots";
import VolumeSelect from "../../ui/VolumeSelect";
import { THEME } from "../../data/theme";
import { priceForVolume } from "../../lib/scoring";

export default function PerfumeDetailsModal({ perfume, volume, onVolumeChange, onClose, onAddToCart, onToggleFavorite }) {
  if (!perfume) return null;
  const activePrice = priceForVolume(perfume.price, volume, perfume.baseVolume);

  return (
    <Modal
      open={Boolean(perfume)}
      onClose={onClose}
      title={`${perfume.brand} • ${perfume.name}`}
      description="Детали аромата"
      footer={
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            className="flex-1 rounded-full px-5 py-3 text-sm font-semibold"
            style={{ background: THEME.accent, color: "#0B0B0F" }}
            onClick={onAddToCart}
          >
            Добавить в корзину ({volume} мл)
          </button>
          <button
            type="button"
            className="flex-1 rounded-full border px-5 py-3 text-sm transition hover:bg-white/[0.06]"
            style={{ borderColor: THEME.border2, color: THEME.text }}
            onClick={onToggleFavorite}
          >
            В избранное
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm" style={{ color: THEME.muted }}>
            {perfume.family}
          </div>
          <div className="text-right">
            <div className="text-xs" style={{ color: THEME.muted }}>
              Цена
            </div>
            <div className="text-xl font-semibold">{activePrice}{perfume.currency}</div>
            <div className="text-xs" style={{ color: THEME.muted2 }}>
              за {volume} мл
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-xs" style={{ color: THEME.muted }}>
          {perfume.tags.map((t) => (
            <span key={t} className="rounded-full border px-3 py-1" style={{ borderColor: THEME.border2 }}>
              {t}
            </span>
          ))}
        </div>

        <div className="rounded-3xl border p-4" style={{ borderColor: THEME.border2, background: THEME.surface2 }}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="text-sm" style={{ color: THEME.text }}>
                Стойкость
              </div>
              <Dots value={perfume.longevity} />
            </div>
            <div className="space-y-2">
              <div className="text-sm" style={{ color: THEME.text }}>
                Шлейф
              </div>
              <Dots value={perfume.sillage} />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 text-xs" style={{ color: THEME.muted }}>
            <span className="rounded-full border px-3 py-1" style={{ borderColor: THEME.border2 }}>
              {perfume.seasons.join(", ")}
            </span>
            <span className="rounded-full border px-3 py-1" style={{ borderColor: THEME.border2 }}>
              {perfume.dayNight.join(", ")}
            </span>
          </div>
        </div>

        <VolumeSelect value={volume} onChange={onVolumeChange} size="compact" />

        <div className="grid gap-3 sm:grid-cols-3">
          <NoteColumn title="Верх" notes={perfume.notes.top} />
          <NoteColumn title="Сердце" notes={perfume.notes.heart} />
          <NoteColumn title="База" notes={perfume.notes.base} />
        </div>
      </div>
    </Modal>
  );
}

function NoteColumn({ title, notes }) {
  return (
    <div className="rounded-3xl border p-4" style={{ borderColor: THEME.border2, background: THEME.surface2 }}>
      <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: THEME.muted2 }}>
        {title}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {notes.map((n) => (
          <span key={n} className="rounded-full border px-3 py-1 text-xs" style={{ borderColor: THEME.border2, color: THEME.text }}>
            {n}
          </span>
        ))}
      </div>
    </div>
  );
}
