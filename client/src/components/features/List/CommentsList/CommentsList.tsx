import { useMsal } from "@azure/msal-react";

import {
  usePatchCommentMutation,
  usePostCommentMutation,
  useVoteCommentMutation,
} from "api";
import { CommentCard } from "components";
import { useScrollLock } from "hooks";
import { Comment, Operation } from "models";
import {
  useAuthenticatedUserStore,
  useCommentsStore,
  useModalsStore,
} from "store";
import { AddCommentCardType, VoteType } from "types";

import { RepliesList } from "../RepliesList";

import { Container } from "./CommentsList.style";

// First-level comments list
export function CommentsList() {
  const { authenticatedUser } = useAuthenticatedUserStore();
  const { comments } = useCommentsStore();
  const { openDeleteModal, setCommentToDelete } = useModalsStore();
  const { instance } = useMsal();
  const { mutate: patchComment } = usePatchCommentMutation();
  const { mutate: postComment } = usePostCommentMutation();
  const { lockScroll } = useScrollLock();
  const { mutate: voteComment } = useVoteCommentMutation();

  function handleButtonClick(newReply: Comment, type: AddCommentCardType) {
    const operations: Operation[] = [
      {
        path: "/text",
        op: "replace",
        value: newReply.text,
      },
    ];

    if (type === "UPDATE") {
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
      {comments.map((comment) => {
        const { id: commentId, replies: commentReplies } = comment;

        return (
          <Container.CommentCard key={commentId}>
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
        );
      })}
    </Container.Comments>
  );
}
