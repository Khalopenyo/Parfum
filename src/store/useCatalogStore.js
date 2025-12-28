import { create } from "zustand";
import { clamp } from "../lib/utils";
import { PERFUMES } from "../data/perfumes";

const defaultVolumeById = (() => {
  const out = {};
  for (const p of PERFUMES) out[p.id] = 50;
  return out;
})();

const initialState = {
  volumeById: defaultVolumeById,
  mustNotes: ["Бергамот"],
  avoidNotes: [],
  seasons: [],
  dayNight: [],
  q: "",
  sort: "match",
};

const useCatalogStore = create((set) => ({
  ...initialState,

  setVolume: (id, v) => {
    const safe = clamp(Number(v) || 50, 10, 100);
    set((state) => ({ volumeById: { ...state.volumeById, [id]: safe } }));
  },

  setMustNotes: (value) => set({ mustNotes: value }),
  setAvoidNotes: (value) => set({ avoidNotes: value }),
  setSeasons: (value) => set({ seasons: value }),
  setDayNight: (value) => set({ dayNight: value }),
  setQ: (value) => set({ q: value }),
  setSort: (value) => set({ sort: value }),

  toggleSeason: (s) =>
    set((state) => ({
      seasons: state.seasons.includes(s)
        ? state.seasons.filter((x) => x !== s)
        : [...state.seasons, s],
    })),

  toggleDayNight: (d) =>
    set((state) => ({
      dayNight: state.dayNight.includes(d)
        ? state.dayNight.filter((x) => x !== d)
        : [...state.dayNight, d],
    })),

  clearAll: () =>
    set((state) => ({
      mustNotes: [],
      avoidNotes: [],
      seasons: [],
      dayNight: [],
      q: "",
      sort: "match",
      volumeById: state.volumeById,
    })),
}));

export { useCatalogStore };
