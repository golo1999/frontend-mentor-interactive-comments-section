import { create } from "zustand";

import { Comment } from "models";

type Store = {
  comments: Comment[];
  setComments: (comments: Comment[]) => void;
};

export const useCommentsStore = create<Store>((set) => ({
  comments: [],
  setComments(comments) {
    set((state) => ({ ...state, comments }));
  },
}));
