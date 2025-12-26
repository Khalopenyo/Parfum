import { useNavigate } from "react-router-dom";
import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Heart, Info, Search, SlidersHorizontal, X } from "lucide-react";
import { useShop } from "../state/shop";
import { clamp, uniq, plural } from "../lib/utils";
import { THEME } from "../data/theme";
import { priceForVolume, scorePerfume } from "../lib/scoring";
import { SEASONS, ALL_NOTES_GROUPS, VOLUME_OPTIONS, PERFUMES } from "../data/perfumes";
import PerfumeCard from "../components/PerfumeCard"

function Dots({ value }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const on = i + 1 <= value;
        return (
          <span
            key={i}
            className={"h-1.5 w-4 rounded-full " + (on ? "bg-white/85" : "bg-white/15")}
          />
        );
      })}
    </div>
  );
}

function SoftButton({ children, onClick, active, title }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition focus:outline-none focus:ring-2 focus:ring-[rgba(127,122,73,0.40)] focus:ring-offset-0 " +
        (active
          ? "border-[rgba(247,242,232,0.20)] bg-white/[0.06] text-white"
          : "border-white/10 bg-white/[0.02] text-white/80 hover:bg-white/[0.05]")
      }
    >
      {children}
    </button>
  );
}

function Chip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 text-sm text-white">
      <span className="text-white/90">{label}</span>
      <button
        type="button"
        onClick={onRemove}
        className="rounded-full p-1 text-white/60 hover:bg-white/10 hover:text-white"
        aria-label={"Удалить " + label}
      >
        <X className="h-4 w-4" />
      </button>
    </span>
  );
}

function SectionCard({ title, subtitle, right, children }) {
  return (
    <div className="rounded-3xl border bg-white/[0.02] p-4" style={{ borderColor: THEME.border2 }}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold" style={{ color: THEME.text }}>
            {title}
          </div>
          {subtitle ? (
            <div className="mt-0.5 text-xs" style={{ color: THEME.muted }}>
              {subtitle}
            </div>
          ) : null}
        </div>
        {right}
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Modal({ open, title, children, onClose }) {
  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
          >
            <div
              className="w-full max-w-2xl overflow-hidden rounded-3xl border shadow-2xl"
              style={{ background: THEME.surface, borderColor: THEME.border }}
              role="dialog"
              aria-modal="true"
              aria-label={title}
            >
              <div
                className="flex items-center justify-between border-b p-5"
                style={{ borderColor: THEME.border2 }}
              >
                <div>
                  <div className="text-base font-semibold" style={{ color: THEME.text }}>
                    {title}
                  </div>
                  <div className="text-xs" style={{ color: THEME.muted }}>
                    Лаконично и по делу
                  </div>
                </div>
                <button
                  type="button"
                  className="rounded-full p-2 hover:bg-white/10"
                  onClick={onClose}
                  aria-label="Закрыть"
                >
                  <X className="h-5 w-5" style={{ color: THEME.muted }} />
                </button>
              </div>

              <div className="space-y-5 p-5" style={{ color: THEME.text }}>
                {children}
              </div>

              <div className="flex justify-end border-t p-5" style={{ borderColor: THEME.border2 }}>
                <button
                  type="button"
                  className="rounded-full px-5 py-2.5 text-sm font-semibold"
                  style={{ background: THEME.accent, color: "#0B0B0F" }}
                  onClick={onClose}
                >
                  Ок
                </button>
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

function VolumeSelect({ value, onChange, size }) {
  const isCompact = size === "compact";

  return (
    <div className={"flex items-center gap-2 " + (isCompact ? "" : "flex-wrap")}
    >
      <div className="text-xs" style={{ color: THEME.muted }}>
        Объём
      </div>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={
          "rounded-2xl border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgba(127,122,73,0.40)] " +
          (isCompact ? "" : "")
        }
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

export default function CatalogPage () {
  const allNotes = useMemo(() => {
    const fromGroups = ALL_NOTES_GROUPS.flatMap((g) => g.notes);
    const fromPerfumes = PERFUMES.flatMap((p) => [...p.notes.top, ...p.notes.heart, ...p.notes.base]);
    return uniq([...fromGroups, ...fromPerfumes]).sort((a, b) => a.localeCompare(b, "ru"));
  }, []);

  const defaultVolumeById = useMemo(() => {
    const out = {};
    for (const p of PERFUMES) out[p.id] = 50;
    return out;
  }, []);

  const [volumeById, setVolumeById] = useState(defaultVolumeById);
  const getVolume = (id) => (volumeById[id] ? volumeById[id] : 50);
  const setVolume = (id, v) => {
    const safe = clamp(Number(v) || 50, 10, 100);
    setVolumeById((prev) => ({ ...prev, [id]: safe }));
  };

  const [mustNotes, setMustNotes] = useState(["Бергамот"]);
  const [avoidNotes, setAvoidNotes] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [dayNight, setDayNight] = useState([]);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("match");

  const [filtersOpenMobile, setFiltersOpenMobile] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  
  const [activePerfume, setActivePerfume] = useState(null);

  const computed = useMemo(() => {
    const query = q.trim().toLowerCase();

    const raw = PERFUMES.map((p) => {
      const score = scorePerfume(p, mustNotes, avoidNotes, seasons, dayNight);
      return { perfume: p, score };
    }).filter(({ perfume }) => {
      if (!query) return true;
      const hay = [
        perfume.brand,
        perfume.name,
        perfume.family,
        perfume.description,
        ...perfume.tags,
        ...perfume.notes.top,
        ...perfume.notes.heart,
        ...perfume.notes.base,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(query);
    });

    const minScore = mustNotes.length ? 1 : -999;
    const filtered = raw.filter((x) => x.score >= minScore);

    const sorted = [...filtered].sort((a, b) => {
      if (sort === "match") return b.score - a.score;
      if (sort === "price_asc") return a.perfume.price - b.perfume.price;
      if (sort === "price_desc") return b.perfume.price - a.perfume.price;
      if (sort === "longevity") return b.perfume.longevity - a.perfume.longevity;
      if (sort === "sillage") return b.perfume.sillage - a.perfume.sillage;
      return b.score - a.score;
    });

    return { total: sorted.length, items: sorted };
  }, [q, mustNotes, avoidNotes, seasons, dayNight, sort]);

  const clearAll = () => {
    setMustNotes([]);
    setAvoidNotes([]);
    setSeasons([]);
    setDayNight([]);
    setQ("");
    setSort("match");
  };

  const toggleSeason = (s) => {
    setSeasons((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };

  const toggleDayNight = (d) => {
    setDayNight((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
  };

  const presets = [
    {
      title: "Лето • свежий цитрус",
      apply: () => {
        setSeasons(["Лето"]);
        setDayNight(["День"]);
        setMustNotes(["Бергамот", "Лимон", "Нероли"]);
        setAvoidNotes(["Уд", "Кожа"]);
        setSort("match");
      },
    },
    {
      title: "Осень • древесность",
      apply: () => {
        setSeasons(["Осень"]);
        setDayNight([]);
        setMustNotes(["Кедр", "Сандал", "Тонка"]);
        setAvoidNotes([]);
        setSort("match");
      },
    },
    {
      title: "Зима • пряный вечер",
      apply: () => {
        setSeasons(["Зима"]);
        setDayNight(["Ночь"]);
        setMustNotes(["Ваниль", "Амбра", "Кардамон"]);
        setAvoidNotes(["Морские ноты"]);
        setSort("match");
      },
    },
    {
      title: "Весна • цветочная нежность",
      apply: () => {
        setSeasons(["Весна"]);
        setDayNight(["День"]);
        setMustNotes(["Пион", "Роза", "Жасмин"]);
        setAvoidNotes(["Табак"]);
        setSort("match");
      },
    },
  ];

  const Filters = (
    <div className="space-y-4">
      <div className="rounded-3xl border p-4" style={{ borderColor: THEME.border2, background: THEME.surface2 }}>
        <div className="text-sm font-semibold" style={{ color: THEME.text }}>
          Быстрый старт
        </div>
        <div className="mt-1 text-xs" style={{ color: THEME.muted }}>
          Пресеты — самый быстрый путь к подходящим ароматам.
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p.title}
              type="button"
              className="rounded-full border px-3 py-1.5 text-sm transition hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-[rgba(127,122,73,0.40)]"
              style={{ borderColor: THEME.border2, color: THEME.text }}
              onClick={p.apply}
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      <SectionCard
        title="Сезон"
        subtitle="Можно выбрать несколько"
        right={
          <button
            type="button"
            className="rounded-full border p-2 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[rgba(127,122,73,0.40)]"
            style={{ borderColor: THEME.border2 }}
            onClick={() => setHelpOpen(true)}
            aria-label="Подсказка"
          >
            <Info className="h-4 w-4" style={{ color: THEME.muted }} />
          </button>
        }
      >
        <div className="flex flex-wrap gap-2">
          {SEASONS.map((s) => (
            <SoftButton key={s.key} active={seasons.includes(s.key)} onClick={() => toggleSeason(s.key)} title={s.hint}>
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: seasons.includes(s.key) ? THEME.accent : "rgba(247,242,232,0.35)" }}
              />
              {s.key}
            </SoftButton>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Время" subtitle="Уточняет подбор">
        <div className="flex flex-wrap gap-2">
          <SoftButton active={dayNight.includes("День")} onClick={() => toggleDayNight("День")}>
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: dayNight.includes("День") ? THEME.accent : "rgba(247,242,232,0.35)" }}
            />
            День
          </SoftButton>
          <SoftButton active={dayNight.includes("Ночь")} onClick={() => toggleDayNight("Ночь")}>
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: dayNight.includes("Ночь") ? THEME.accent : "rgba(247,242,232,0.35)" }}
            />
            Ночь
          </SoftButton>
        </div>
      </SectionCard>

      <NotePicker
        title="Хочу слышать"
        value={mustNotes}
        onChange={setMustNotes}
        placeholder="Например: ваниль, ирис, бергамот..."
        tone="include"
        allNotes={allNotes}
      />

      <NotePicker
        title="Не подходит"
        value={avoidNotes}
        onChange={setAvoidNotes}
        placeholder="Например: уд, табак, кожа..."
        tone="exclude"
        allNotes={allNotes}
      />

      <SectionCard title="Популярные ноты" subtitle="Нажмите, чтобы добавить в 'Хочу слышать'">
        <div className="space-y-3">
          {ALL_NOTES_GROUPS.map((g) => (
            <div key={g.label}>
              <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: THEME.muted2 }}>
                {g.label}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {g.notes.map((n) => {
                  const active = mustNotes.includes(n);
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => {
                        if (active) setMustNotes(mustNotes.filter((x) => x !== n));
                        else setMustNotes([...mustNotes, n]);
                      }}
                      className="rounded-full border px-3 py-1.5 text-sm transition hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-[rgba(127,122,73,0.40)]"
                      style={{
                        borderColor: active ? "rgba(247,242,232,0.20)" : THEME.border2,
                        color: THEME.text,
                        background: active ? "rgba(127,122,73,0.14)" : "transparent",
                      }}
                    >
                      {active ? (
                        <span className="mr-1 inline-flex align-middle">
                          <Check className="h-4 w-4" style={{ color: THEME.accent }} />
                        </span>
                      ) : null}
                      {n}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );

  const activeVolume = activePerfume ? getVolume(activePerfume.id) : 50;
  const activePrice = activePerfume ? priceForVolume(activePerfume.price, activeVolume, activePerfume.baseVolume) : 0;
const navigate = useNavigate();
const { favorites, toggleFavorite, addToCart } = useShop();

  return (
    <div className="min-h-screen" style={{ background: THEME.bg, color: THEME.text }}>
      <header
        className="sticky top-0 z-30 border-b backdrop-blur"
        style={{ borderColor: THEME.border2, background: "rgba(12,12,16,0.72)" }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <div
              className="grid h-10 w-10 place-items-center rounded-2xl border"
              style={{ borderColor: THEME.border2, background: "rgba(255,255,255,0.02)" }}
            >
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: THEME.accent }} />
            </div>
            <div>
              <div className="text-sm font-semibold" style={{ letterSpacing: 0.2 }}>
                Bakhur
              </div>
              <div className="text-xs" style={{ color: THEME.muted }}>
                Сертифицированные маслянные ароматы 
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="hidden rounded-full border px-4 py-2 text-sm transition hover:bg-white/[0.06] sm:inline-flex"
              style={{ borderColor: THEME.border2, color: THEME.text }}
              onClick={() => setHelpOpen(true)}
            >
              <Info className="mr-2 h-4 w-4" style={{ color: THEME.muted }} />
              {/* Как работает подбор */}
            </button>

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition hover:bg-white/[0.06] sm:hidden"
              style={{ borderColor: THEME.border2, color: THEME.text }}
              onClick={() => setFiltersOpenMobile(true)}
            >
              <SlidersHorizontal className="h-4 w-4" style={{ color: THEME.muted }} />
              Фильтры
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-8 md:grid-cols-12">
        <aside className="hidden md:col-span-4 md:block">
          <div className="sticky top-[76px] space-y-4">{Filters}</div>
          <button
            type="button"
            className="mt-4 w-full rounded-full border px-4 py-2.5 text-sm transition hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-[rgba(127,122,73,0.40)]"
            style={{ borderColor: THEME.border2, color: THEME.text }}
            onClick={clearAll}
          >
            Сбросить всё
          </button>
        </aside>

        <section className="md:col-span-8">
          <div className="rounded-3xl border p-4" style={{ borderColor: THEME.border2, background: THEME.surface2 }}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2"
                  style={{ color: THEME.muted2 }}
                />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="w-full rounded-2xl border bg-transparent px-11 py-3 text-sm outline-none focus:ring-2 focus:ring-[rgba(127,122,73,0.40)]"
                  style={{ borderColor: THEME.border2, color: THEME.text }}
                  placeholder="Поиск по бренду, названию, нотам..."
                />
                {q ? (
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 hover:bg-white/10"
                    onClick={() => setQ("")}
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
                  onChange={(e) => setSort(e.target.value)}
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
                  onClick={() => setFiltersOpenMobile(true)}
                >
                  <SlidersHorizontal className="h-4 w-4" style={{ color: THEME.muted }} />
                  Фильтры
                </button>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full border px-3 py-1.5 text-sm" style={{ borderColor: THEME.border2, color: THEME.text }}>
                {computed.total} {plural(computed.total, "вариант", "варианта", "вариантов")}
              </span>
              {favorites.length ? (
  <span
    className="rounded-full border px-3 py-1.5 text-sm"
    style={{ borderColor: THEME.border2, color: THEME.text }}
  >
    <Heart className="mr-2 inline-block h-4 w-4" style={{ color: THEME.accent }} />
    {favorites.length} {plural(favorites.length, "избранный", "избранных", "избранных")}
  </span>
) : null}


              <button
                type="button"
                className="ml-auto rounded-full border px-4 py-1.5 text-sm transition hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-[rgba(127,122,73,0.40)]"
                style={{ borderColor: THEME.border2, color: THEME.text }}
                onClick={clearAll}
              >
                Сбросить
              </button>
            </div>
          </div>

          {computed.total === 0 ? (
            <div className="mt-5 rounded-3xl border p-6" style={{ borderColor: THEME.border2, background: THEME.surface2 }}>
              <div className="text-lg font-semibold" style={{ color: THEME.text }}>
                Ничего не найдено
              </div>
              <div className="mt-2 text-sm" style={{ color: THEME.muted }}>
                Ослабьте фильтры: уберите "Не подходит", выберите меньше "Хочу слышать" или снимите сезон.
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="rounded-full px-5 py-2.5 text-sm font-semibold"
                  style={{ background: THEME.accent, color: "#0B0B0F" }}
                  onClick={() => {
                    setAvoidNotes([]);
                    setSeasons([]);
                    setDayNight([]);
                  }}
                >
                  Ослабить фильтры
                </button>
                <button
                  type="button"
                  className="rounded-full border px-5 py-2.5 text-sm transition hover:bg-white/[0.06]"
                  style={{ borderColor: THEME.border2, color: THEME.text }}
                  onClick={clearAll}
                > 
                  Сбросить всё
                </button>
              </div>
            </div>
          ) : (
            
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <AnimatePresence>
                {computed.items.map(({ perfume, score }) => (
                  <PerfumeCard
                      key={perfume.id}
                      perfume={perfume}
                      score={score}
                      liked={favorites.includes(perfume.id)}
                      volume={getVolume(perfume.id)}
                      onVolumeChange={(v) => setVolume(perfume.id, v)}
                      onLike={() => toggleFavorite(perfume.id)}
                      onDetails={() => navigate(`/perfumes/${perfume.id}`)}
                      onAddToCart={() => {
                        addToCart(perfume.id, getVolume(perfume.id), 1);
                        navigate("/cart"); // если не хочешь переходить в корзину — удали эту строку
                      }}
                    />

                  
                ))}
              </AnimatePresence>
            </div>
          )}

          <div className="mt-10 border-t pt-6" style={{ borderColor: THEME.border2 }}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs" style={{ color: THEME.muted2 }}>
                © {new Date().getFullYear()} Aroma Atelier
              </div>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm transition hover:bg-white/[0.06]"
                style={{ borderColor: THEME.border2, color: THEME.text }}
                onClick={() => setHelpOpen(true)}
              >
                <Info className="h-4 w-4" style={{ color: THEME.muted }} />
                Логика подбора
              </button>
            </div>
          </div>
        </section>
      </main>

      <AnimatePresence>
        {filtersOpenMobile ? (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFiltersOpenMobile(false)}
            />
            <motion.div
              className="fixed inset-x-0 bottom-0 z-50 max-h-[86vh] overflow-auto rounded-t-3xl border p-4"
              style={{ background: THEME.surface, borderColor: THEME.border }}
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold" style={{ color: THEME.text }}>
                    Фильтры
                  </div>
                  <div className="text-xs" style={{ color: THEME.muted }}>
                    Подбор по нотам и сезону
                  </div>
                </div>
                <button
                  type="button"
                  className="rounded-full border p-2 hover:bg-white/10"
                  style={{ borderColor: THEME.border2 }}
                  onClick={() => setFiltersOpenMobile(false)}
                  aria-label="Закрыть"
                >
                  <X className="h-5 w-5" style={{ color: THEME.muted }} />
                </button>
              </div>

              <div className="mt-4 space-y-4">{Filters}</div>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  className="flex-1 rounded-full border px-4 py-3 text-sm transition hover:bg-white/[0.06]"
                  style={{ borderColor: THEME.border2, color: THEME.text }}
                  onClick={clearAll}
                >
                  Сбросить
                </button>
                <button
                  type="button"
                  className="flex-1 rounded-full px-4 py-3 text-sm font-semibold"
                  style={{ background: THEME.accent, color: "#0B0B0F" }}
                  onClick={() => setFiltersOpenMobile(false)}
                >
                  Показать ({computed.total})
                </button>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>

      <Modal open={helpOpen} title="Как работает подбор" onClose={() => setHelpOpen(false)}>
        <div className="space-y-3 text-sm" style={{ color: THEME.text }}>
          <p>
            <span className="font-semibold">Ноты</span>: берём верх/сердце/базу и считаем совпадения с "Хочу слышать".
            Чем больше совпало — тем выше в выдаче.
          </p>
          <p>
            <span className="font-semibold">Исключения</span>: если "Не подходит" встречается в пирамиде — рейтинг сильно
            падает.
          </p>
          <p>
            <span className="font-semibold">Сезон и время суток</span>: мягкие бонусы, чтобы рекомендации звучали уместно.
          </p>
          <p style={{ color: THEME.muted }}>
            Для быстрого результата: 2–4 "Хочу" + 0–2 "Исключить", затем сезон.
          </p>
        </div>
      </Modal>

      <Modal
        open={Boolean(activePerfume)}
        title={activePerfume ? activePerfume.brand + " — " + activePerfume.name : ""}
        onClose={() => setActivePerfume(null)}
      >
        {activePerfume ? (
          <div className="space-y-5">
            <div className="rounded-3xl border p-4" style={{ borderColor: THEME.border2, background: THEME.surface2 }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-4">
                  <div
                    className="h-32 w-32 shrink-0 overflow-hidden rounded-3xl border"
                    style={{ borderColor: THEME.border2, background: "rgba(255,255,255,0.02)" }}
                  >
                    <img
                      src={activePerfume.image}
                      alt={activePerfume.brand + " " + activePerfume.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <div className="text-sm" style={{ color: THEME.muted }}>
                      {activePerfume.family}
                    </div>
                    <div className="mt-1 text-2xl font-semibold" style={{ color: THEME.text }}>
                      {activePerfume.name}
                    </div>
                    <div className="mt-2 text-sm" style={{ color: THEME.muted }}>
                      {activePerfume.description}
                    </div>

                    <div className="mt-4">
                      <VolumeSelect
                        value={activeVolume}
                        onChange={(v) => setVolume(activePerfume.id, v)}
                        size="regular"
                      />
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs" style={{ color: THEME.muted }}>
                    Цена
                  </div>
                  <div className="mt-1 text-2xl font-semibold" style={{ color: THEME.text }}>
                    {activePrice}
                    {activePerfume.currency}
                  </div>
                  <div className="mt-1 text-xs" style={{ color: THEME.muted2 }}>
                    за {activeVolume} мл
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {activePerfume.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border px-3 py-1 text-xs"
                    style={{ borderColor: THEME.border2, color: THEME.text, background: "rgba(255,255,255,0.02)" }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border px-3 py-2" style={{ borderColor: THEME.border2, background: "rgba(255,255,255,0.02)" }}>
                  <div className="text-xs" style={{ color: THEME.muted }}>
                    Сезоны
                  </div>
                  <div className="mt-1 text-sm" style={{ color: THEME.text }}>
                    {activePerfume.seasons.join(", ")}
                  </div>
                </div>
                <div className="rounded-2xl border px-3 py-2" style={{ borderColor: THEME.border2, background: "rgba(255,255,255,0.02)" }}>
                  <div className="text-xs" style={{ color: THEME.muted }}>
                    Подходит
                  </div>
                  <div className="mt-1 text-sm" style={{ color: THEME.text }}>
                    {activePerfume.dayNight.join(", ")}
                  </div>
                </div>
                <div className="rounded-2xl border px-3 py-2" style={{ borderColor: THEME.border2, background: "rgba(255,255,255,0.02)" }}>
                  <div className="text-xs" style={{ color: THEME.muted }}>
                    Профиль
                  </div>
                  <div className="mt-1 flex items-center justify-between gap-3">
                    <span className="text-sm" style={{ color: THEME.text }}>
                      Стойкость
                    </span>
                    <Dots value={activePerfume.longevity} />
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <span className="text-sm" style={{ color: THEME.text }}>
                      Шлейф
                    </span>
                    <Dots value={activePerfume.sillage} />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border p-4" style={{ borderColor: THEME.border2, background: THEME.surface2 }}>
                <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: THEME.muted2 }}>
                  Верх
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {activePerfume.notes.top.map((n) => (
                    <span key={n} className="rounded-full border px-3 py-1 text-xs" style={{ borderColor: THEME.border2, color: THEME.text }}>
                      {n}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl border p-4" style={{ borderColor: THEME.border2, background: THEME.surface2 }}>
                <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: THEME.muted2 }}>
                  Сердце
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {activePerfume.notes.heart.map((n) => (
                    <span key={n} className="rounded-full border px-3 py-1 text-xs" style={{ borderColor: THEME.border2, color: THEME.text }}>
                      {n}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl border p-4" style={{ borderColor: THEME.border2, background: THEME.surface2 }}>
                <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: THEME.muted2 }}>
                  База
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {activePerfume.notes.base.map((n) => (
                    <span key={n} className="rounded-full border px-3 py-1 text-xs" style={{ borderColor: THEME.border2, color: THEME.text }}>
                      {n}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                className="flex-1 rounded-full px-5 py-3 text-sm font-semibold"
                style={{ background: THEME.accent, color: "#0B0B0F" }}
                onClick={() => {
  addToCart(activePerfume.id, activeVolume, 1);
  setActivePerfume(null);
}}

              >
                Добавить в корзину ({activeVolume} мл)
              </button>
              <button
                type="button"
                className="flex-1 rounded-full border px-5 py-3 text-sm transition hover:bg-white/[0.06]"
                style={{ borderColor: THEME.border2, color: THEME.text }}
                onClick={() => toggleFavorite(activePerfume.id)}

              >
                В избранное
              </button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}

// ------------------------------------------------------------
// Tiny self-tests (run only in Jest/CRA test env)
// ------------------------------------------------------------

function __assert(condition, message) {
  if (!condition) throw new Error("Test failed: " + message);
}

function runUnitTests() {
  const p = PERFUMES[0];
  __assert(p.notes.top.length > 0, "seed perfume has top notes");

  const s0 = scorePerfume(p, ["Бергамот"], [], [], []);
  const s1 = scorePerfume(p, ["Несуществующая"], [], [], []);
  __assert(s0 > s1, "matching note improves score");

  const s2 = scorePerfume(p, ["Бергамот"], ["Мускус"], [], []);
  __assert(s2 < s0, "avoid note decreases score");

  const s3 = scorePerfume(p, [], [], ["Лето"], ["День"]);
  __assert(Number.isFinite(s3), "score is finite");

  // Extra tests
  
  __assert(plural(1, "a", "b", "c") === "a", "plural 1 works");
  __assert(plural(2, "a", "b", "c") === "b", "plural 2 works");
  __assert(plural(5, "a", "b", "c") === "c", "plural 5 works");
  __assert(clamp(10, 0, 5) === 5, "clamp upper bound");
  __assert(clamp(-1, 0, 5) === 0, "clamp lower bound");

  // Volume price demo tests
  __assert(priceForVolume(100, 50, 50) === 100, "priceForVolume base stays same");
  __assert(priceForVolume(100, 10, 50) === 20, "priceForVolume scales down");
  __assert(priceForVolume(100, 100, 50) === 200, "priceForVolume scales up");
}

const __RUN_TESTS__ =
  typeof process !== "undefined" && process && process.env && process.env.NODE_ENV === "test";

if (__RUN_TESTS__) {
  runUnitTests();
}
