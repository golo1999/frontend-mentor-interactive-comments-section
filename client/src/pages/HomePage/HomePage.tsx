import { useState } from "react";

import { AddCommentCard, CommentCard, DeleteModal } from "components";
import { useScrollLock } from "hooks";
import { Comment } from "models";
import { useCommentsStore } from "store";
import { AddCommentCardType } from "types";
import { createPortal } from "react-dom";

import { Container, Line } from "./HomePage.style";

export function HomePage() {
  const {
    comments,
    addComment,
    deleteComment,
    downvoteComment,
    updateComment,
    upvoteComment,
  } = useCommentsStore();
  const { lockScroll, unlockScroll } = useScrollLock();
  const [commentToDelete, setCommentToDelete] = useState<Comment>();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  function handleDeleteModalClose() {
    setCommentToDelete(undefined);
    unlockScroll();
    setIsDeleteModalOpen(false);
  }

  function handleDeleteModalConfirm() {
    if (commentToDelete) {
      deleteComment(commentToDelete);
    }
  }

  return (
    <Container.Main>
      {comments.length > 0 && (
        <Container.Comments>
          {comments.map((comment) => {
            const { id: commentId, replies: commentReplies } = comment;

            function handleCommentButtonClick(
              newReply: Comment,
              type: AddCommentCardType
            ) {
              if (type === "UPDATE") {
                updateComment(newReply);
                return;
              }

              addComment(newReply);
            }

            function handleCommentDeleteClick() {
              setCommentToDelete(comment);
              lockScroll();
              setIsDeleteModalOpen(true);
            }

            function handleCommentDownvoteClick() {
              if (comment.userId !== "me") {
                downvoteComment(comment);
              }
            }

            function handleCommentUpvoteClick() {
              if (comment.userId !== "me") {
                upvoteComment(comment);
              }
            }

            return (
              <Container.CommentCard key={commentId}>
                <CommentCard
                  comment={comment}
                  onButtonClick={handleCommentButtonClick}
                  onDeleteClick={handleCommentDeleteClick}
                  onDownvoteClick={handleCommentDownvoteClick}
                  onUpvoteClick={handleCommentUpvoteClick}
                />
                {commentReplies && commentReplies.length > 0 && (
                  <Container.CommentReplies.Outer>
                    <Line />
                    <Container.CommentReplies.Inner>
                      {commentReplies.map((reply) => {
                        const { id: replyId } = reply;

                        function handleReplyButtonClick(
                          newReply: Comment,
                          type: AddCommentCardType
                        ) {
                          if (type === "UPDATE") {
                            updateComment(newReply);
                            return;
                          }

                          addComment(newReply);
                        }

                        function handleReplyDeleteClick() {
                          setCommentToDelete(reply);
                          lockScroll();
                          setIsDeleteModalOpen(true);
                        }

                        function handleReplyDownvoteClick() {
                          if (reply.userId !== "me") {
                            downvoteComment(reply);
                          }
                        }

                        function handleReplyUpvoteClick() {
                          if (reply.userId !== "me") {
                            upvoteComment(reply);
                          }
                        }

                        return (
                          <CommentCard
                            comment={reply}
                            key={replyId}
                            onButtonClick={handleReplyButtonClick}
                            onDeleteClick={handleReplyDeleteClick}
                            onDownvoteClick={handleReplyDownvoteClick}
                            onUpvoteClick={handleReplyUpvoteClick}
                          />
                        );
                      })}
                    </Container.CommentReplies.Inner>
                  </Container.CommentReplies.Outer>
                )}
              </Container.CommentCard>
            );
          })}
        </Container.Comments>
      )}
      <AddCommentCard onButtonClick={(newComment) => addComment(newComment)} />
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
