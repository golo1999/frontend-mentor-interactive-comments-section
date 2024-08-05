import { Comment } from "models";
import { AddCommentCardType } from "types";

type CommonProps = { onButtonClick: (comment: Comment) => void };

type ConditionalProps =
  | { comment?: never; type?: never }
  | { comment?: never; type: Extract<AddCommentCardType, "COMMENT"> }
  | { comment: Comment; type: Extract<AddCommentCardType, "REPLY" | "UPDATE"> };

export type Props = CommonProps & ConditionalProps;
