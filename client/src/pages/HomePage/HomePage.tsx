import { useMsal } from "@azure/msal-react";

import { useEffect, useState } from "react";

import {
  useDeleteCommentMutation,
  useDownvoteCommentMutation,
  useGetCommentsQuery,
  usePatchCommentMutation,
  usePostCommentMutation,
  useUpvoteCommentMutation,
} from "api";
import { AddCommentCard, CommentCard, DeleteModal } from "components";
import { useScrollLock } from "hooks";
import { Comment } from "models";
import { useAuthenticatedUserStore, useCommentsStore } from "store";
import { AddCommentCardType } from "types";
import { createPortal } from "react-dom";

import { Container, Line } from "./HomePage.style";

export function HomePage() {
  const { authenticatedUser } = useAuthenticatedUserStore();
  const { comments, setComments } = useCommentsStore();
  const { instance } = useMsal();
  const { data: fetchedComments, status } = useGetCommentsQuery(instance);
  const {
    error: deleteCommentError,
    isSuccess: isDeleteCommentSuccessful,
    mutate: deleteComment,
  } = useDeleteCommentMutation();
  const {
    data: downvotedComment,
    error: downvoteCommentError,
    isSuccess: isDownvoteCommentSuccessful,
    mutate: downvoteComment,
  } = useDownvoteCommentMutation();
  const {
    data: patchedComment,
    error: patchCommentError,
    isSuccess: isPatchCommentSuccessful,
    mutate: patchComment,
  } = usePatchCommentMutation();
  const {
    data: addedComment,
    error: postCommentError,
    isSuccess: isPostCommentSuccessful,
    mutate: postComment,
  } = usePostCommentMutation();
  const {
    data: upvotedComment,
    error: upvoteCommentError,
    isSuccess: isUpvoteCommentSuccessful,
    mutate: upvoteComment,
  } = useUpvoteCommentMutation();
  const { lockScroll, unlockScroll } = useScrollLock();
  const [commentToDelete, setCommentToDelete] = useState<Comment>();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (fetchedComments) {
      setComments(fetchedComments);
    }
  }, [fetchedComments, setComments]);

  function handleDeleteModalClose() {
    setCommentToDelete(undefined);
    unlockScroll();
    setIsDeleteModalOpen(false);
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
                patchComment({
                  id: newReply.id,
                  instance,
                  operations: [
                    {
                      path: "/text",
                      op: "replace",
                      value: newReply.text,
                    },
                  ],
                  parentId: newReply.parentId,
                });
                return;
              }

              postComment({ commentDTO: { ...newReply }, instance });
            }

            function handleCommentDeleteClick() {
              setCommentToDelete(comment);
              lockScroll();
              setIsDeleteModalOpen(true);
            }

            function handleCommentDownvoteClick() {
              if (comment.userId !== authenticatedUser?.id) {
                downvoteComment({
                  id: comment.id,
                  instance,
                });
              }
            }

            function handleCommentUpvoteClick() {
              if (comment.userId !== authenticatedUser?.id) {
                upvoteComment({ id: comment.id, instance });
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
                            patchComment({
                              id: newReply.id,
                              instance,
                              operations: [
                                {
                                  path: "/text",
                                  op: "replace",
                                  value: newReply.text,
                                },
                              ],
                              parentId: newReply.parentId,
                            });
                            return;
                          }

                          postComment({
                            commentDTO: { ...newReply },
                            instance,
                          });
                        }

                        function handleReplyDeleteClick() {
                          setCommentToDelete(reply);
                          lockScroll();
                          setIsDeleteModalOpen(true);
                        }

                        function handleReplyDownvoteClick() {
                          if (reply.userId !== authenticatedUser?.id) {
                            downvoteComment({
                              id: reply.id,
                              instance,
                              parentId: reply.parentId,
                            });
                          }
                        }

                        function handleReplyUpvoteClick() {
                          if (reply.userId !== authenticatedUser?.id) {
                            upvoteComment({
                              id: reply.id,
                              instance,
                              parentId: reply.parentId,
                            });
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
      <AddCommentCard
        onButtonClick={(newComment) =>
          postComment({ commentDTO: { ...newComment }, instance })
        }
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
