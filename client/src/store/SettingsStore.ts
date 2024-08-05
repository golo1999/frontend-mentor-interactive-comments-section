import { create } from "zustand";

type Store = {
  scrollPosition: number;
  setScrollPosition: (scrollPosition: number) => void;
};

export const useSettingsStore = create<Store>((set) => ({
  scrollPosition: 0,
  setScrollPosition(scrollPosition) {
    set((state) => ({ ...state, scrollPosition }));
  },
}));
