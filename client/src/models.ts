import { VoteType } from "types";

export type User = {
  id: string;
  username: string;
};

type CommentCommonProps = {
  dateTime: string;
  id: string;
  replies: Comment[];
  score: number;
  text: string;
  user: User;
  userId: string;
  votes: Vote[];
};

type CommentConditionalProps =
  | { parentId: string; replyToUser: User; replyToUserId: string }
  | { parentId?: never; replyToUser?: never; replyToUserId?: never };

export type Comment = CommentCommonProps & CommentConditionalProps;

export type Vote = {
  commentId: string;
  id: string;
  type: VoteType;
  userId: string;
};
