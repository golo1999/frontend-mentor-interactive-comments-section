import { useMsal } from "@azure/msal-react";

import { useEffect } from "react";
import styled from "styled-components";

import {
  useDeleteCommentMutation,
  useGetCommentsQuery,
  usePostCommentMutation,
} from "api";
import { Colors } from "colors";
import { AddCommentCard, CommentsList, DeleteModal } from "components";
import { useScrollLock } from "hooks";
import {
  useAuthenticatedUserStore,
  useCommentsStore,
  useModalsStore,
} from "store";
import { createPortal } from "react-dom";

const Container = {
  Main: styled.div`
    background-color: ${Colors.Neutral.VeryLightGray};
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 4.26vw;
    padding: 8.53vw 4.26vw;

    @media screen {
      @media (min-width: 768px) {
        gap: 2.083vw;
        padding: 4.16vw 10vw;
      }

      @media (min-width: 1200px) {
        gap: 1.11vw;
        padding: 4.44vw 26.5vw;
      }
    }
  `,
};

export function HomePage() {
  const { authenticatedUser } = useAuthenticatedUserStore();
  const { comments, setComments } = useCommentsStore();
  const {
    commentToDelete,
    isDeleteModalOpen,
    closeDeleteModal,
    setCommentToDelete,
  } = useModalsStore();
  const { instance } = useMsal();
  const { data: fetchedComments, status: fetchCommentsStatus } =
    useGetCommentsQuery(instance);
  const { mutate: deleteComment } = useDeleteCommentMutation();
  const { mutate: postComment } = usePostCommentMutation();
  const { unlockScroll } = useScrollLock();

  useEffect(() => {
    if (fetchedComments) {
      setComments(fetchedComments);
    }
  }, [fetchedComments, setComments]);

  function handleDeleteModalClose() {
    setCommentToDelete(undefined);
    unlockScroll();
    closeDeleteModal();
  }

  function handleDeleteModalConfirm() {
    if (commentToDelete) {
      deleteComment(
        {
          id: commentToDelete.id,
          instance,
          parentId: commentToDelete.parentId,
        },
        // TODO
        {
          onError: (error) => {
            console.log({ error });
          },
          onSuccess: (deletedComment) => {
            console.log({ deletedComment });
          },
        }
      );
    }
  }

  if (fetchCommentsStatus === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <Container.Main>
      {comments.length > 0 && <CommentsList />}
      {authenticatedUser && (
        <AddCommentCard
          onButtonClick={(newComment) =>
            postComment({ commentDTO: { ...newComment }, instance })
          }
        />
      )}
      {isDeleteModalOpen &&
        createPortal(
          <DeleteModal
            onClose={handleDeleteModalClose}
            onDelete={handleDeleteModalConfirm}
          />,
          document.body
        )}
    </Container.Main>
  );
}
