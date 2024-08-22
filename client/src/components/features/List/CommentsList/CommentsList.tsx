import { useMsal } from "@azure/msal-react";

import { Fragment, useEffect } from "react";
import { useQueryClient } from "react-query";
import { Waypoint } from "react-waypoint";

import {
  usePatchCommentMutation,
  usePostCommentMutation,
  useVoteCommentMutation,
} from "api";
import { CommentCard } from "components";
import { useScrollLock } from "hooks";
import { Comment, Operation, PaginatedResult } from "models";
import {
  useAuthenticatedUserStore,
  useCommentsStore,
  useModalsStore,
} from "store";
import { AddCommentCardType, VoteType } from "types";

import { RepliesList } from "../RepliesList";

import { Container, Text } from "./CommentsList.style";

interface Props {
  isFetching: boolean;
  onEndReached: () => void;
}

// First-level comments list
export function CommentsList({ isFetching, onEndReached }: Props) {
  const { authenticatedUser } = useAuthenticatedUserStore();
  const { comments, setComments } = useCommentsStore();
  const { openDeleteModal, setCommentToDelete } = useModalsStore();
  const { instance } = useMsal();
  const queryClient = useQueryClient();
  const { isSuccess: isPatchSuccessful, mutate: patchComment } =
    usePatchCommentMutation();
  const { isSuccess: isPostSuccessful, mutate: postComment } =
    usePostCommentMutation();
  const { lockScroll } = useScrollLock();
  const { isSuccess: isVoteSuccessful, mutate: voteComment } =
    useVoteCommentMutation();

  useEffect(() => {
    if (isPatchSuccessful || isPostSuccessful || isVoteSuccessful) {
      const mainList =
        queryClient.getQueryData<PaginatedResult<Comment>>("comments");

      if (mainList) {
        setComments(mainList.edges.map(({ node }) => node));
      }
    }
  }, [
    isPatchSuccessful,
    isPostSuccessful,
    isVoteSuccessful,
    queryClient,
    setComments,
  ]);

  function handleButtonClick(newReply: Comment, type: AddCommentCardType) {
    if (type === "UPDATE") {
      const operations: Operation[] = [
        {
          path: "/text",
          op: "replace",
          value: newReply.text,
        },
      ];

      patchComment({
        id: newReply.id,
        instance,
        operations,
        parentId: newReply.parentId,
      });
      return;
    }

    postComment({ commentDTO: { ...newReply }, instance });
  }

  function handleDeleteClick(comment: Comment) {
    setCommentToDelete(comment);
    lockScroll();
    openDeleteModal();
  }

  function handleVoteClick(comment: Comment, voteType: VoteType) {
    if (authenticatedUser && comment.userId !== authenticatedUser?.id) {
      voteComment({ id: comment.id, instance, voteType });
    }
  }

  return (
    <Container.Comments>
      {comments.map((comment, index, items) => {
        const { id: commentId, replies: commentReplies } = comment;

        return (
          <Fragment key={commentId}>
            <Container.CommentCard>
              <CommentCard
                comment={comment}
                onButtonClick={handleButtonClick}
                onDeleteClick={() => handleDeleteClick(comment)}
                onDownvoteClick={() => handleVoteClick(comment, "DOWN")}
                onUpvoteClick={() => handleVoteClick(comment, "UP")}
              />
              {commentReplies.length > 0 && (
                <RepliesList replies={commentReplies} />
              )}
            </Container.CommentCard>
            {index === items.length - 1 && (
              <Waypoint onEnter={onEndReached}>
                {isFetching ? <Text.Loading>Loading...</Text.Loading> : null}
              </Waypoint>
            )}
          </Fragment>
        );
      })}
    </Container.Comments>
  );
}
