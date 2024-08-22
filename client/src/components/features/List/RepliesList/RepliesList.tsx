import { useMsal } from "@azure/msal-react";

import { useEffect } from "react";
import { useQueryClient } from "react-query";

import {
  usePatchCommentMutation,
  usePostCommentMutation,
  useVoteCommentMutation,
} from "api";
import { CommentCard } from "components";
import { Comment, Operation, PaginatedResult } from "models";
import { useScrollLock } from "hooks";
import {
  useAuthenticatedUserStore,
  useCommentsStore,
  useModalsStore,
} from "store";
import { AddCommentCardType, VoteType } from "types";

import { Container, Line } from "./RepliesList.style";

interface Props {
  replies: Comment[];
}

// Nested replies list for a specific comment
export function RepliesList({ replies }: Props) {
  const { authenticatedUser } = useAuthenticatedUserStore();
  const { setComments } = useCommentsStore();
  const { openDeleteModal, setCommentToDelete } = useModalsStore();
  const { instance } = useMsal();
  const queryClient = useQueryClient();
  const { isSuccess: isPatchSuccessful, mutate: patchComment } =
    usePatchCommentMutation();
  const { mutate: postComment } = usePostCommentMutation();
  const { lockScroll } = useScrollLock();
  const { isSuccess: isVoteSuccessful, mutate: voteComment } =
    useVoteCommentMutation();

  useEffect(() => {
    if (isPatchSuccessful || isVoteSuccessful) {
      const mainList =
        queryClient.getQueryData<PaginatedResult<Comment>>("comments");

      if (mainList) {
        setComments(mainList.edges.map(({ node }) => node));
      }
    }
  }, [isPatchSuccessful, isVoteSuccessful, queryClient, setComments]);

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

    postComment({
      commentDTO: { ...newReply },
      instance,
    });
  }

  function handleDeleteClick(reply: Comment) {
    setCommentToDelete(reply);
    lockScroll();
    openDeleteModal();
  }

  function handleVoteClick(reply: Comment, voteType: VoteType) {
    if (authenticatedUser && reply.userId !== authenticatedUser?.id) {
      voteComment({
        id: reply.id,
        instance,
        parentId: reply.parentId,
        voteType,
      });
    }
  }

  return (
    <Container.CommentReplies.Outer>
      <Line />
      <Container.CommentReplies.Inner>
        {replies.map((reply) => {
          const { id: replyId } = reply;

          return (
            <CommentCard
              comment={reply}
              key={replyId}
              onButtonClick={handleButtonClick}
              onDeleteClick={() => handleDeleteClick(reply)}
              onDownvoteClick={() => handleVoteClick(reply, "DOWN")}
              onUpvoteClick={() => handleVoteClick(reply, "UP")}
            />
          );
        })}
      </Container.CommentReplies.Inner>
    </Container.CommentReplies.Outer>
  );
}
