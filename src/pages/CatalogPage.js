import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Info } from "lucide-react";
import { THEME } from "../data/theme";
import { PERFUMES } from "../data/perfumes";
import { clamp, plural } from "../lib/utils";
import { useShop } from "../state/shop";
import FiltersPanel from "../components/catalog/FiltersPanel";
import SortingSearchBar from "../components/catalog/SortingSearchBar";
import PerfumeGrid from "../components/catalog/PerfumeGrid";
import FiltersDrawer from "../components/catalog/FiltersDrawer";
import PerfumeDetailsModal from "../components/catalog/PerfumeDetailsModal";
import Modal from "../ui/Modal";
import { useFilteredPerfumes } from "../hooks/useFilteredPerfumes";
import { useCatalogFilters } from "../store/useCatalogFilters";

export default function CatalogPage() {
  const navigate = useNavigate();
  const { favorites, toggleFavorite, addToCart } = useShop();
  const { resetFilters, setAvoidNotes, setDayNight, setSeasons } = useCatalogFilters((state) => ({
    resetFilters: state.resetFilters,
    setAvoidNotes: state.setAvoidNotes,
    setDayNight: state.setDayNight,
    setSeasons: state.setSeasons,
  }));

  const [filtersOpenMobile, setFiltersOpenMobile] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [activePerfume, setActivePerfume] = useState(null);

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

  const computed = useFilteredPerfumes();

  const handleDetails = (id) => setActivePerfume(PERFUMES.find((p) => p.id === id));
  const handleAddToCart = (perfume) => {
    addToCart(perfume.id, getVolume(perfume.id), 1);
    navigate("/cart");
  };

  const activeVolume = activePerfume ? getVolume(activePerfume.id) : 50;

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
              Фильтры
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-8 md:grid-cols-12">
        <aside className="hidden md:col-span-4 md:block">
          <div className="sticky top-[76px] space-y-4">
            <FiltersPanel />
          </div>
        </aside>

        <section className="md:col-span-8">
          <SortingSearchBar
            onOpenFilters={() => setFiltersOpenMobile(true)}
            total={`${computed.total} ${plural(computed.total, "вариант", "варианта", "вариантов")}`}
            favoritesCount={favorites.length}
          />

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
                  onClick={resetFilters}
                >
                  Сбросить всё
                </button>
              </div>
            </div>
          ) : (
            <PerfumeGrid
              items={computed.items}
              favorites={favorites}
              getVolume={getVolume}
              setVolume={setVolume}
              onLike={toggleFavorite}
              onDetails={(id) => handleDetails(id)}
              onAddToCart={handleAddToCart}
            />
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

      <FiltersDrawer open={filtersOpenMobile} onClose={() => setFiltersOpenMobile(false)} />

      <PerfumeDetailsModal
        perfume={activePerfume}
        volume={activeVolume}
        onVolumeChange={(v) => setVolume(activePerfume.id, v)}
        onClose={() => setActivePerfume(null)}
        onAddToCart={() => {
          if (!activePerfume) return;
          addToCart(activePerfume.id, activeVolume, 1);
          setActivePerfume(null);
          navigate("/cart");
        }}
        onToggleFavorite={() => activePerfume && toggleFavorite(activePerfume.id)}
      />

      <Modal
        open={helpOpen}
        onClose={() => setHelpOpen(false)}
        title="Как работает подбор"
        description="Алгоритм использует ноты, сезон и время суток"
        footer={
          <button
            type="button"
            className="w-full rounded-full border px-4 py-2 text-sm"
            onClick={() => setHelpOpen(false)}
          >
            Ок
          </button>
        }
      >
        <div className="space-y-3 text-sm" style={{ color: THEME.muted }}>
          <p>
            Мы рассчитываем совпадение ноты/характеристик и ранжируем ароматы по релевантности. Добавьте 1-2 ноты, затем
            поиграйтесь с сезонностью и временем суток.
          </p>
          <p>
            Если результатов мало — попробуйте ослабить ограничения или нажмите «Сбросить фильтры» в панели фильтров.
          </p>
        </div>
      </Modal>
    </div>
  );
}
