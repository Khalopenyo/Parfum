import React, { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import SectionCard from "../../ui/SectionCard";
import Chip from "../../ui/Chip";
import SoftButton from "../../ui/SoftButton";
import { plural, uniq } from "../../lib/utils";
import { THEME } from "../../data/theme";
import { ALL_NOTES_GROUPS, SEASONS } from "../../data/perfumes";
import { useCatalogFilters, filtersShallow } from "../../store/useCatalogFilters";

function NotePicker({ title, value, onChange, placeholder, tone, allNotes }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = allNotes.filter((n) => !value.includes(n));
    if (!q) return base.slice(0, 14);
    return base.filter((n) => n.toLowerCase().includes(q)).slice(0, 14);
  }, [query, allNotes, value]);

  const badgeStyle =
    tone === "include"
      ? { borderColor: "rgba(247,242,232,0.18)", background: "rgba(127,122,73,0.14)" }
      : { borderColor: "rgba(247,242,232,0.18)", background: "rgba(247,242,232,0.06)" };

  return (
    <SectionCard
      title={title}
      subtitle={tone === "include" ? "Выберите ноты, которые хотите слышать" : "Отметьте ноты, которые точно не подходят"}
      right={
        <div className="rounded-full border px-3 py-1 text-xs" style={{ ...badgeStyle, color: THEME.text }}>
          {value.length} {plural(value.length, "нота", "ноты", "нот")}
        </div>
      }
    >
      <div className="flex flex-wrap gap-2">
        {value.length === 0 ? (
          <div className="text-sm" style={{ color: THEME.muted }}>
            Пока пусто.
          </div>
        ) : (
          value.map((n) => <Chip key={n} label={n} onRemove={() => onChange(value.filter((x) => x !== n))} />)
        )}
      </div>

      <div className="mt-4">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
            style={{ color: THEME.muted2 }}
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-2xl border bg-transparent px-10 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[rgba(127,122,73,0.40)]"
            style={{ borderColor: THEME.border2, color: THEME.text }}
            placeholder={placeholder}
          />
          {query ? (
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 hover:bg-white/10"
              onClick={() => setQuery("")}
              aria-label="Очистить"
            >
              <X className="h-4 w-4" style={{ color: THEME.muted }} />
            </button>
          ) : null}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {filtered.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => {
                onChange([...value, n]);
                setQuery("");
              }}
              className="rounded-full border px-3 py-1.5 text-sm transition hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-[rgba(127,122,73,0.40)]"
              style={{ borderColor: THEME.border2, color: THEME.text }}
            >
              <span
                className="mr-2 inline-block h-1.5 w-1.5 rounded-full align-middle"
                style={{ background: tone === "include" ? THEME.accent : "rgba(247,242,232,0.60)" }}
              />
              {n}
            </button>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}

export default function FiltersPanel({ onClose }) {
  const { mustNotes, avoidNotes, seasons, dayNight } = useCatalogFilters(
    (state) => ({
      mustNotes: state.mustNotes,
      avoidNotes: state.avoidNotes,
      seasons: state.seasons,
      dayNight: state.dayNight,
    }),
    filtersShallow
  );

  const { setMustNotes, setAvoidNotes, toggleSeason, toggleDayNight, resetFilters, hasActiveFilters } = useCatalogFilters((state) => ({
    setMustNotes: state.setMustNotes,
    setAvoidNotes: state.setAvoidNotes,
    toggleSeason: state.toggleSeason,
    toggleDayNight: state.toggleDayNight,
    resetFilters: state.resetFilters,
    hasActiveFilters: state.hasActiveFilters,
  }));

  const allNotes = useMemo(() => {
    const fromGroups = ALL_NOTES_GROUPS.flatMap((g) => g.notes);
    return uniq(fromGroups).sort((a, b) => a.localeCompare(b, "ru"));
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="text-sm font-semibold" style={{ color: THEME.text }}>
            Фильтры
          </div>
          <div className="text-xs" style={{ color: THEME.muted }}>
            Подберите ноты и настроение
          </div>
        </div>
        <button
          type="button"
          onClick={resetFilters}
          disabled={!hasActiveFilters()}
          title={hasActiveFilters() ? "Сбросить выбранные фильтры" : "Нечего сбрасывать"}
          className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-[rgba(127,122,73,0.40)] disabled:cursor-not-allowed disabled:opacity-50"
          style={{ borderColor: THEME.border2, color: THEME.text }}
        >
          Сбросить фильтры
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {SEASONS.map((s) => (
          <SoftButton
            key={s.key}
            title={s.hint}
            active={seasons.includes(s.key)}
            onClick={() => toggleSeason(s.key)}
          >
            {s.key}
          </SoftButton>
        ))}
        <SoftButton active={dayNight.includes("День")} onClick={() => toggleDayNight("День")}>День</SoftButton>
        <SoftButton active={dayNight.includes("Ночь")} onClick={() => toggleDayNight("Ночь")}>Ночь</SoftButton>
      </div>

      <NotePicker
        title="Хочу слышать"
        placeholder="Цитрус, ваниль, жасмин..."
        tone="include"
        value={mustNotes}
        onChange={setMustNotes}
        allNotes={allNotes}
      />

      <NotePicker
        title="Не подходит"
        placeholder="Кожа, горькое, уд..."
        tone="exclude"
        value={avoidNotes}
        onChange={setAvoidNotes}
        allNotes={allNotes}
      />

      {onClose ? (
        <button
          type="button"
          className="w-full rounded-full border px-4 py-2.5 text-sm transition hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-[rgba(127,122,73,0.40)]"
          style={{ borderColor: THEME.border2, color: THEME.text }}
          onClick={onClose}
        >
          Свернуть фильтры
        </button>
      ) : null}
    </div>
  );
}
