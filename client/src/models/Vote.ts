import { VoteType } from "types";

export type Vote = {
  commentId: string;
  id: string;
  parentCommentId?: string;
  type: VoteType;
  userId: string;
};
