import { useMemo } from "react";
import { scorePerfume } from "../lib/scoring";
import { PERFUMES } from "../data/perfumes";
import { selectFilters, useCatalogFilters, filtersShallow } from "../store/useCatalogFilters";

export function useFilteredPerfumes() {
  const { q, mustNotes, avoidNotes, seasons, dayNight, sort } = useCatalogFilters(selectFilters, filtersShallow);

  return useMemo(() => {
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
}
