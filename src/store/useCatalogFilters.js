import create from "zustand";
import shallow from "zustand/shallow";

const defaultState = {
  mustNotes: ["Бергамот"],
  avoidNotes: [],
  seasons: [],
  dayNight: [],
  q: "",
  sort: "match",
};

const toggler = (key) => (set) => (value) =>
  set((state) => ({
    [key]: state[key].includes(value)
      ? state[key].filter((x) => x !== value)
      : [...state[key], value],
  }));

export const useCatalogFilters = create((set, get) => ({
  ...defaultState,
  setMustNotes: (mustNotes) => set({ mustNotes }),
  setAvoidNotes: (avoidNotes) => set({ avoidNotes }),
  setSeasons: (seasons) => set({ seasons }),
  setDayNight: (dayNight) => set({ dayNight }),
  setSearch: (q) => set({ q }),
  setSort: (sort) => set({ sort }),
  toggleSeason: toggler("seasons")(set),
  toggleDayNight: toggler("dayNight")(set),
  resetFilters: () => set({ ...defaultState }),
  applyPreset: (updater) =>
    set((state) => {
      const nextState = typeof updater === "function" ? updater(state) : updater;
      return { ...state, ...nextState };
    }),
  hasActiveFilters: () => {
    const { mustNotes, avoidNotes, seasons, dayNight, q, sort } = get();
    return (
      mustNotes.length > defaultState.mustNotes.length ||
      avoidNotes.length > 0 ||
      seasons.length > 0 ||
      dayNight.length > 0 ||
      q.trim().length > 0 ||
      sort !== defaultState.sort
    );
  },
}));

export const selectFilters = (state) => ({
  mustNotes: state.mustNotes,
  avoidNotes: state.avoidNotes,
  seasons: state.seasons,
  dayNight: state.dayNight,
  q: state.q,
  sort: state.sort,
});

export const filtersShallow = shallow;
