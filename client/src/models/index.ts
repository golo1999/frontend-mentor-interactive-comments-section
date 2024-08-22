import { OperationType } from "enums";
import { VoteType } from "types";

export * from "./Comment";
export * from "./PaginatedResult";

export type Operation = {
  operationType?: OperationType;
  from?: string;
  op?: string;
  path?: string;
  value?: any;
};

export type User = {
  emailAddress: string;
  id: string;
  username: string;
};

export type Vote = {
  commentId: string;
  id: string;
  parentCommentId?: string;
  type: VoteType;
  userId: string;
};
