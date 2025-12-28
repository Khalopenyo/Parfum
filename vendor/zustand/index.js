import { useSyncExternalStore } from "react";

// Minimalistic Zustand-compatible create function tailored for this project.
export default function create(createState) {
  let state;
  const listeners = new Set();

  const setState = (partial, replace) => {
    const nextState = typeof partial === "function" ? partial(state) : partial;
    if (nextState === state) return;
    const newState = replace ? nextState : { ...state, ...nextState };
    state = newState;
    listeners.forEach((listener) => listener());
  };

  const getState = () => state;
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const api = { setState, getState, subscribe }; // minimal api
  state = createState(setState, getState, api);

  const useBoundStore = (selector = (s) => s, equalityFn = Object.is) =>
    useSyncExternalStore(
      subscribe,
      () => selector(state),
      () => selector(state),
      equalityFn
    );

  useBoundStore.setState = setState;
  useBoundStore.getState = getState;
  useBoundStore.subscribe = subscribe;

  return useBoundStore;
}

export { create };
