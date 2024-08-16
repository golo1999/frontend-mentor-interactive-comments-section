import { create } from "zustand";

import { USERS } from "mocks";
import { User } from "models";

type Store = {
  authenticatedUser: User | undefined;
  setAuthenticatedUser: (user: User | undefined) => void;
};

export const useAuthenticatedUserStore = create<Store>((set) => ({
  authenticatedUser: USERS.find((user) => user.username === "me"),
  setAuthenticatedUser(authenticatedUser) {
    set((state) => ({ ...state, authenticatedUser }));
  },
}));
