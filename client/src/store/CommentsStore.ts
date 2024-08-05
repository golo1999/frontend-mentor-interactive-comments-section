import dayjs from "dayjs";
import { create } from "zustand";

import { COMMENTS } from "consts";
import { Comment, Vote } from "models";

type Store = {
  comments: Comment[];
  addComment: (comment: Comment) => void;
  deleteComment: (comment: Comment) => void;
  downvoteComment: (comment: Comment) => void;
  setComments: (comments: Comment[]) => void;
  updateComment: (comment: Comment) => void;
  upvoteComment: (comment: Comment) => void;
};

export const useCommentsStore = create<Store>((set) => ({
  comments: COMMENTS,
  addComment(addedComment) {
    // First level comment
    if (!addedComment.parentId) {
      set((state) => ({
        ...state,
        comments: [...state.comments, addedComment],
      }));
      return;
    }

    // Nested comment
    set((state) => ({
      ...state,
      comments: state.comments.map((existingComment) => {
        if (existingComment.id === addedComment.parentId) {
          return {
            ...existingComment,
            replies: [...existingComment.replies, addedComment],
          };
        }

        return existingComment;
      }),
    }));
  },
  deleteComment(deletedComment) {
    // First level comment
    if (!deletedComment.parentId) {
      set((state) => ({
        ...state,
        comments: state.comments.filter(
          (existingComment) => existingComment.id !== deletedComment.id
        ),
      }));
      return;
    }

    // Nested comment
    set((state) => ({
      ...state,
      comments: state.comments.map((existingComment) => {
        if (existingComment.id === deletedComment.parentId) {
          return {
            ...existingComment,
            replies: existingComment.replies.filter(
              (existingReply) => existingReply.id !== deletedComment.id
            ),
          };
        }

        return existingComment;
      }),
    }));
  },
  downvoteComment(comment) {
    const newVote: Vote = {
      commentId: comment.id,
      id: `vote-${dayjs().toISOString()}`,
      type: "DOWN",
      userId: "me",
    };

    // First level comment
    if (!comment.parentId) {
      if (comment.votes.length === 0) {
        set((state) => ({
          ...state,
          comments: state.comments.map((existingComment) => {
            if (existingComment.id === comment.id) {
              return {
                ...existingComment,
                score: -1,
                votes: [newVote],
              };
            }

            return existingComment;
          }),
        }));

        return;
      }

      const userVote = comment.votes.find((vote) => vote.userId === "me");

      if (!userVote) {
        set((state) => ({
          ...state,
          comments: state.comments.map((existingComment) => {
            if (existingComment.id === comment.id) {
              return {
                ...existingComment,
                score: existingComment.score - 1,
                votes: [...existingComment.votes, newVote],
              };
            }

            return existingComment;
          }),
        }));

        return;
      }

      if (userVote.type === "UP") {
        set((state) => ({
          ...state,
          comments: state.comments.map((existingComment) => {
            if (existingComment.id === comment.id) {
              return {
                ...existingComment,
                score: existingComment.score - 2,
                votes: existingComment.votes.map((vote) => {
                  if (vote.userId === "me") {
                    return { ...vote, type: "DOWN" };
                  }

                  return vote;
                }),
              };
            }

            return existingComment;
          }),
        }));

        return;
      }

      set((state) => ({
        ...state,
        comments: state.comments.map((existingComment) => {
          if (existingComment.id === comment.id) {
            return {
              ...existingComment,
              score: existingComment.score + 1,
              votes: existingComment.votes.filter(
                (vote) => vote.userId !== "me"
              ),
            };
          }

          return existingComment;
        }),
      }));

      return;
    }

    // Nested comment
    if (comment.votes.length === 0) {
      set((state) => ({
        ...state,
        comments: state.comments.map((existingComment) => {
          if (existingComment.id === comment.parentId) {
            return {
              ...existingComment,
              replies: existingComment.replies.map((existingReply) => {
                if (existingReply.id === comment.id) {
                  return { ...existingReply, score: -1, votes: [newVote] };
                }

                return existingReply;
              }),
            };
          }

          return existingComment;
        }),
      }));

      return;
    }

    const userVote = comment.votes.find((vote) => vote.userId === "me");

    if (!userVote) {
      set((state) => ({
        ...state,
        comments: state.comments.map((existingComment) => {
          if (existingComment.id === comment.parentId) {
            return {
              ...existingComment,
              replies: existingComment.replies.map((existingReply) => {
                if (existingReply.id === comment.id) {
                  return {
                    ...existingReply,
                    score: existingReply.score - 1,
                    votes: [...existingReply.votes, newVote],
                  };
                }

                return existingReply;
              }),
            };
          }

          return existingComment;
        }),
      }));

      return;
    }

    if (userVote.type === "UP") {
      set((state) => ({
        ...state,
        comments: state.comments.map((existingComment) => {
          if (existingComment.id === comment.parentId) {
            return {
              ...existingComment,
              replies: existingComment.replies.map((existingReply) => {
                if (existingReply.id === comment.id) {
                  return {
                    ...existingReply,
                    score: existingReply.score - 2,
                    votes: existingReply.votes.map((vote) => {
                      if (vote.userId === "me") {
                        return { ...vote, type: "DOWN" };
                      }

                      return vote;
                    }),
                  };
                }

                return existingReply;
              }),
            };
          }

          return existingComment;
        }),
      }));

      return;
    }

    set((state) => ({
      ...state,
      comments: state.comments.map((existingComment) => {
        if (existingComment.id === comment.parentId) {
          return {
            ...existingComment,
            replies: existingComment.replies.map((existingReply) => {
              if (existingReply.id === comment.id) {
                return {
                  ...existingReply,
                  score: existingReply.score + 1,
                  votes: existingReply.votes.filter(
                    (vote) => vote.userId !== "me"
                  ),
                };
              }

              return existingReply;
            }),
          };
        }

        return existingComment;
      }),
    }));
  },
  setComments(comments) {
    set((state) => ({ ...state, comments }));
  },
  updateComment(updatedComment) {
    // First level comment
    if (!updatedComment.parentId) {
      set((state) => ({
        ...state,
        comments: state.comments.map((existingComment) =>
          existingComment.id === updatedComment.id
            ? updatedComment
            : existingComment
        ),
      }));
      return;
    }

    // Nested comment
    set((state) => ({
      ...state,
      comments: state.comments.map((existingComment) => {
        if (existingComment.id === updatedComment.parentId) {
          return {
            ...existingComment,
            replies: existingComment.replies.map((existingReply) => {
              if (existingReply.id === updatedComment.id) {
                return updatedComment;
              }

              return existingReply;
            }),
          };
        }

        return existingComment;
      }),
    }));
  },
  upvoteComment(comment) {
    const newVote: Vote = {
      commentId: comment.id,
      id: `vote-${dayjs().toISOString()}`,
      type: "UP",
      userId: "me",
    };

    // First level comment
    if (!comment.parentId) {
      if (comment.votes.length === 0) {
        set((state) => ({
          ...state,
          comments: state.comments.map((existingComment) => {
            if (existingComment.id === comment.id) {
              return {
                ...existingComment,
                score: 1,
                votes: [newVote],
              };
            }

            return existingComment;
          }),
        }));

        return;
      }

      const userVote = comment.votes.find((vote) => vote.userId === "me");

      if (!userVote) {
        set((state) => ({
          ...state,
          comments: state.comments.map((existingComment) => {
            if (existingComment.id === comment.id) {
              return {
                ...existingComment,
                score: existingComment.score + 1,
                votes: [...existingComment.votes, newVote],
              };
            }

            return existingComment;
          }),
        }));

        return;
      }

      if (userVote.type === "DOWN") {
        set((state) => ({
          ...state,
          comments: state.comments.map((existingComment) => {
            if (existingComment.id === comment.id) {
              return {
                ...existingComment,
                score: existingComment.score + 2,
                votes: existingComment.votes.map((vote) => {
                  if (vote.userId === "me") {
                    return { ...vote, type: "UP" };
                  }

                  return vote;
                }),
              };
            }

            return existingComment;
          }),
        }));

        return;
      }

      set((state) => ({
        ...state,
        comments: state.comments.map((existingComment) => {
          if (existingComment.id === comment.id) {
            return {
              ...existingComment,
              score: existingComment.score - 1,
              votes: existingComment.votes.filter(
                (vote) => vote.userId !== "me"
              ),
            };
          }

          return existingComment;
        }),
      }));

      return;
    }

    // Nested comment
    if (comment.votes.length === 0) {
      set((state) => ({
        ...state,
        comments: state.comments.map((existingComment) => {
          if (existingComment.id === comment.parentId) {
            return {
              ...existingComment,
              replies: existingComment.replies.map((existingReply) => {
                if (existingReply.id === comment.id) {
                  return { ...existingReply, score: 1, votes: [newVote] };
                }

                return existingReply;
              }),
            };
          }

          return existingComment;
        }),
      }));

      return;
    }

    const userVote = comment.votes.find((vote) => vote.userId === "me");

    if (!userVote) {
      set((state) => ({
        ...state,
        comments: state.comments.map((existingComment) => {
          if (existingComment.id === comment.parentId) {
            return {
              ...existingComment,
              replies: existingComment.replies.map((existingReply) => {
                if (existingReply.id === comment.id) {
                  return {
                    ...existingReply,
                    score: existingReply.score + 1,
                    votes: [...existingReply.votes, newVote],
                  };
                }

                return existingReply;
              }),
            };
          }

          return existingComment;
        }),
      }));

      return;
    }

    if (userVote.type === "DOWN") {
      set((state) => ({
        ...state,
        comments: state.comments.map((existingComment) => {
          if (existingComment.id === comment.parentId) {
            return {
              ...existingComment,
              replies: existingComment.replies.map((existingReply) => {
                if (existingReply.id === comment.id) {
                  return {
                    ...existingReply,
                    score: existingReply.score + 2,
                    votes: existingReply.votes.map((vote) => {
                      if (vote.userId === "me") {
                        return { ...vote, type: "UP" };
                      }

                      return vote;
                    }),
                  };
                }

                return existingReply;
              }),
            };
          }

          return existingComment;
        }),
      }));

      return;
    }

    set((state) => ({
      ...state,
      comments: state.comments.map((existingComment) => {
        if (existingComment.id === comment.parentId) {
          return {
            ...existingComment,
            replies: existingComment.replies.map((existingReply) => {
              if (existingReply.id === comment.id) {
                return {
                  ...existingReply,
                  score: existingReply.score - 1,
                  votes: existingReply.votes.filter(
                    (vote) => vote.userId !== "me"
                  ),
                };
              }

              return existingReply;
            }),
          };
        }

        return existingComment;
      }),
    }));
  },
}));
