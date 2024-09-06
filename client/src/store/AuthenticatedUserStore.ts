import { create } from "zustand";

import { User, UserWithToken } from "models";

type Store = {
  authenticatedUser: User | UserWithToken | undefined;
  setAuthenticatedUser: (user: User | UserWithToken | undefined) => void;
};

export const useAuthenticatedUserStore = create<Store>((set) => ({
  authenticatedUser: undefined,
  setAuthenticatedUser(authenticatedUser) {
    set((state) => ({ ...state, authenticatedUser }));
  },
}));
