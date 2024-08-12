import { OperationType } from "enums";
import { VoteType } from "types";

export type User = {
  emailAddress: string;
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

export type CommentDTO = Pick<Comment, "parentId" | "replyToUserId" | "text">;

export type Operation = {
  operationType?: OperationType;
  from?: string;
  op?: string;
  path?: string;
  value?: any;
};

export type Vote = {
  commentId: string;
  id: string;
  type: VoteType;
  userId: string;
};
