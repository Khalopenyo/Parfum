import React from "react";
import { THEME } from "../data/theme";
import { VOLUME_OPTIONS } from "../data/perfumes";

export default function VolumeSelect({ value, onChange, size = "default" }) {
  const isCompact = size === "compact";

  return (
    <div className={`flex items-center gap-2 ${isCompact ? "" : "flex-wrap"}`}>
      <div className="text-xs" style={{ color: THEME.muted }}>
        Объём
      </div>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`rounded-2xl border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgba(127,122,73,0.40)] ${isCompact ? "" : ""}`}
        style={{ borderColor: THEME.border2, color: THEME.text }}
        aria-label="Выбор объёма"
      >
        {VOLUME_OPTIONS.map((v) => (
          <option key={v} value={v}>
            {v} мл
          </option>
        ))}
      </select>
    </div>
  );
}
