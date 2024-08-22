import { User, Vote } from "models";

type CommonProps = {
  dateTime: string;
  id: string;
  replies: Comment[];
  score: number;
  text: string;
  user: User;
  userId: string;
  votes: Vote[];
};

type ConditionalProps =
  | { parentId: string; replyToUser: User; replyToUserId: string }
  | { parentId?: never; replyToUser?: never; replyToUserId?: never };

export type Comment = CommonProps & ConditionalProps;

export type CommentDTO = Pick<Comment, "parentId" | "replyToUserId" | "text">;
