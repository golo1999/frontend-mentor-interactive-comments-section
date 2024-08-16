import { create } from "zustand";

import { Comment } from "models";

type Store = {
  commentToDelete: Comment | undefined;
  isDeleteModalOpen: boolean;
  closeDeleteModal: () => void;
  openDeleteModal: () => void;
  setCommentToDelete: (commentToDelete: Comment | undefined) => void;
};

export const useModalsStore = create<Store>((set) => ({
  commentToDelete: undefined,
  isDeleteModalOpen: false,
  closeDeleteModal() {
    const { isDeleteModalOpen } = useModalsStore.getState();

    if (isDeleteModalOpen) {
      set((state) => ({ ...state, isDeleteModalOpen: false }));
    }
  },
  openDeleteModal() {
    const { isDeleteModalOpen } = useModalsStore.getState();

    if (!isDeleteModalOpen) {
      set((state) => ({ ...state, isDeleteModalOpen: true }));
    }
  },
  setCommentToDelete(commentToDelete) {
    set((state) => ({ ...state, commentToDelete }));
  },
}));
