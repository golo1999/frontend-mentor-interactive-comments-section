import { create } from "zustand";
import { persist } from "zustand/middleware";

import { Theme } from "types";

type Store = {
  isNavbarMenuOpen: boolean;
  scrollPosition: number;
  theme: Theme;
  changeTheme: (theme: Theme) => void;
  closeNavbarMenu: () => void;
  openNavbarMenu: () => void;
  setScrollPosition: (scrollPosition: number) => void;
};

export const useSettingsStore = create<Store>()(
  persist(
    (set) => ({
      isNavbarMenuOpen: false,
      scrollPosition: 0,
      theme: "LIGHT",
      changeTheme(newTheme) {
        const { theme } = useSettingsStore.getState();

        if (newTheme !== theme) {
          set((state) => ({ ...state, theme: newTheme }));
        }
      },
      closeNavbarMenu() {
        const { isNavbarMenuOpen } = useSettingsStore.getState();

        if (isNavbarMenuOpen) {
          set((state) => ({ ...state, isNavbarMenuOpen: false }));
        }
      },
      openNavbarMenu() {
        const { isNavbarMenuOpen } = useSettingsStore.getState();

        if (!isNavbarMenuOpen) {
          set((state) => ({ ...state, isNavbarMenuOpen: true }));
        }
      },
      setScrollPosition(newScrollPosition) {
        const { scrollPosition } = useSettingsStore.getState();

        if (newScrollPosition !== scrollPosition) {
          set((state) => ({ ...state, scrollPosition: newScrollPosition }));
        }
      },
    }),
    {
      name: "interactive-comments-section-settings",
      partialize: ({ theme }) => ({ theme }),
    }
  )
);
