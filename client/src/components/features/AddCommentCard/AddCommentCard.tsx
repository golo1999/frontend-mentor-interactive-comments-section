import dayjs from "dayjs";
import { createRef, useCallback, useMemo, useState } from "react";

import { Card, ConditionalWrapper, Photo } from "components";
import { USERS } from "consts";
import { useDeviceType } from "hooks";
import { Comment, User } from "models";

import { Button, Container, TextArea } from "./AddCommentCard.style";
import { Props } from "./AddCommentCard.types";

export function AddCommentCard({
  comment,
  type = "COMMENT",
  onButtonClick,
}: Props) {
  const deviceType = useDeviceType();

  const getParentCommentUser = useCallback(() => {
    let user: User | undefined = undefined;

    if (type === "REPLY") {
      user = USERS.find((user) => user.id === comment!.userId)!;
    } else if (type === "UPDATE" && comment?.parentId) {
      user = USERS.find((user) => user.id === comment!.replyToUserId)!;
    }

    return user;
  }, [comment, type]);

  const parentCommentUser = getParentCommentUser()!;

  const getDefaultText = useCallback(() => {
    if (type === "COMMENT") {
      return "";
    }

    if (type === "REPLY") {
      return `@${parentCommentUser.username} `;
    }

    if (comment?.parentId) {
      return `@${parentCommentUser.username} ${comment!.text}`;
    }

    return comment!.text;
  }, [comment, parentCommentUser, type]);

  const [text, setText] = useState(getDefaultText());
  const textAreaRef = createRef<HTMLTextAreaElement>();

  const trimmedText = text.trim();

  function handleButtonClick() {
    const currentDateTime = dayjs().toISOString();
    const currentUser: User = {
      id: "me",
      username: "me",
    };
    let returnedComment: Comment;
    let returnedCommentText: string;

    switch (type) {
      case "COMMENT":
        returnedComment = {
          dateTime: currentDateTime,
          id: currentDateTime,
          replies: [],
          score: 0,
          text,
          user: currentUser,
          userId: "me",
          votes: [],
        };
        break;
      case "REPLY":
        returnedCommentText = trimmedText.startsWith(
          `@${parentCommentUser.username}`
        )
          ? trimmedText.replace(`@${parentCommentUser.username}`, "").trim()
          : trimmedText;
        returnedComment = {
          dateTime: currentDateTime,
          id: currentDateTime,
          parentId: comment?.parentId || comment!.id,
          replyToUser: parentCommentUser,
          replyToUserId: parentCommentUser!.id,
          replies: [],
          score: 0,
          text: returnedCommentText,
          user: currentUser,
          userId: "me",
          votes: [],
        };
        break;
      case "UPDATE":
        returnedCommentText =
          comment?.parentId &&
          trimmedText.startsWith(`@${parentCommentUser.username}`)
            ? trimmedText.replace(`@${parentCommentUser.username}`, "").trim()
            : trimmedText;
        returnedComment = {
          ...comment!,
          text: returnedCommentText,
        };
        break;
    }

    setText("");
    onButtonClick(returnedComment);
  }

  const isButtonDisabled = useMemo(() => {
    switch (type) {
      case "COMMENT":
        if (trimmedText.length === 0) {
          return true;
        }
        break;
      case "REPLY":
        if (
          trimmedText.startsWith(`@${parentCommentUser.username}`) &&
          trimmedText.replace(`@${parentCommentUser.username}`, "").trim()
            .length === 0
        ) {
          return true;
        }
        break;
      case "UPDATE":
        if (comment?.parentId) {
          if (
            trimmedText.startsWith(`@${parentCommentUser.username}`) &&
            trimmedText.replace(`@${parentCommentUser.username}`, "").trim()
              .length === 0
          ) {
            return true;
          }
        } else if (trimmedText.length === 0) {
          return true;
        }
        break;
    }

    return false;
  }, [comment, parentCommentUser, trimmedText, type]);

  const isLargeDevice = useMemo(
    () => deviceType === "LAPTOP" || deviceType === "DESKTOP",
    [deviceType]
  );

  const buttonText =
    type === "COMMENT" ? "Send" : type === "REPLY" ? "Reply" : "Update";

  return (
    <Card
      alignItems={isLargeDevice ? "flex-start" : undefined}
      horizontal={isLargeDevice}
    >
      <TextArea
        placeholder="Add a comment..."
        ref={textAreaRef}
        rows={5}
        value={text}
        onChange={({ target: { value } }) => setText(value)}
      />
      <ConditionalWrapper
        condition={!isLargeDevice}
        wrapper={(children) => <Container.Bottom>{children}</Container.Bottom>}
      >
        <Photo />
        <Button disabled={isButtonDisabled} onClick={handleButtonClick}>
          {buttonText}
        </Button>
      </ConditionalWrapper>
    </Card>
  );
}
