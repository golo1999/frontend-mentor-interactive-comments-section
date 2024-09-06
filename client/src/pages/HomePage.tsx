import { useMsal } from "@azure/msal-react";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useQueryClient } from "react-query";
import styled from "styled-components";

import {
  useDeleteCommentMutation,
  useGetCommentsQuery,
  usePostCommentMutation,
} from "api";
import {
  AddCommentCard,
  CommentsList,
  DeleteModal,
  Navbar,
  ScrollButton,
} from "components";
import { useScrollLock } from "hooks";
import { Comment, PaginatedResult } from "models";
import { ErrorPage, LoadingPage } from "pages";
import {
  useAuthenticatedUserStore,
  useCommentsStore,
  useModalsStore,
} from "store";

const Container = {
  Main: styled.div`
    background-color: ${({ theme }) => theme.colors.background.primary};
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
  const { isSuccess: isDeleteSuccessful, mutate: deleteComment } =
    useDeleteCommentMutation();
  const { instance } = useMsal();
  const [after, setAfter] = useState<string>();
  const {
    data: fetchedComments,
    isFetching,
    status: fetchCommentsStatus,
  } = useGetCommentsQuery({ after, first: 5, instance });
  const {
    commentToDelete,
    isDeleteModalOpen,
    closeDeleteModal,
    setCommentToDelete,
  } = useModalsStore();
  const queryClient = useQueryClient();
  const { isSuccess: isPostSuccessful, mutate: postComment } =
    usePostCommentMutation();
  const { unlockScroll } = useScrollLock();

  const setMainList = useCallback(() => {
    const mainList =
      queryClient.getQueryData<PaginatedResult<Comment>>("comments");

    if (mainList) {
      setComments(mainList.edges.map(({ node }) => node));
    }
  }, [queryClient, setComments]);

  useEffect(() => setMainList(), [fetchedComments, setMainList]);

  useEffect(() => {
    if (isDeleteSuccessful || isPostSuccessful) {
      setMainList();
    }
  }, [isDeleteSuccessful, isPostSuccessful, setMainList]);

  function handleCommentsListEndReached() {
    if (
      fetchedComments?.pageInfo.hasNextPage &&
      after !== fetchedComments?.pageInfo.endCursor
    ) {
      setAfter(fetchedComments?.pageInfo.endCursor || undefined);
    }
  }

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

  function handleScrollButtonClick() {
    window.scrollTo({ behavior: "smooth", top: 0 });
  }

  if (fetchCommentsStatus === "idle" || fetchCommentsStatus === "loading") {
    return <LoadingPage />;
  }

  if (fetchCommentsStatus === "error") {
    return <ErrorPage />;
  }

  const isScrollButtonVisible = window.scrollY > window.innerHeight / 2;

  return (
    <Container.Main>
      <Navbar />
      {authenticatedUser && (
        <AddCommentCard
          onButtonClick={(newComment) =>
            postComment({ commentDTO: { ...newComment }, instance })
          }
        />
      )}
      {comments.length > 0 && (
        <CommentsList
          isFetching={isFetching}
          onEndReached={handleCommentsListEndReached}
        />
      )}
      <ScrollButton
        isVisible={isScrollButtonVisible}
        onClick={handleScrollButtonClick}
      />
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
