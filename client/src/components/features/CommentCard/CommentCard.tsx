import dayjs from "dayjs";
import { useMemo, useState } from "react";

import { AddCommentCard, Card, Photo } from "components";
import { useDeviceType } from "hooks";
import { Comment } from "models";
import type { AddCommentCardType } from "types";

import { Container, Icon, Text } from "./CommentCard.style";

interface Props {
  comment: Comment;
  onButtonClick: (comment: Comment, type: AddCommentCardType) => void;
  onDeleteClick: () => void;
  onDownvoteClick: () => void;
  onUpvoteClick: () => void;
}

export function CommentCard({
  comment,
  onButtonClick,
  onDeleteClick,
  onDownvoteClick,
  onUpvoteClick,
}: Props) {
  const {
    dateTime,
    parentId,
    replyToUser,
    score,
    text,
    user: { id: userId, username },
  } = comment;

  const deviceType = useDeviceType();
  const [addCommentCardType, setAddCommentCardType] =
    useState<Extract<AddCommentCardType, "REPLY" | "UPDATE">>("REPLY");
  const [isAddCommentCardVisible, setIsAddCommentCardVisible] = useState(false);

  function getDateTimeDifferenceText() {
    const currentDateTime = dayjs();
    const commentDateTime = dayjs(dateTime);

    const differenceMinutes = currentDateTime.diff(commentDateTime, "minutes");
    if (differenceMinutes < 1) {
      return "Just now";
    }

    const differenceHours = currentDateTime.diff(commentDateTime, "hours");
    if (differenceHours < 1) {
      return differenceMinutes === 1
        ? "1 minute ago"
        : `${differenceMinutes} minutes ago`;
    }

    const differenceDays = currentDateTime.diff(commentDateTime, "days");
    if (differenceDays < 1) {
      return differenceHours === 1
        ? "1 hour ago"
        : `${differenceHours} hours ago`;
    }

    const differenceWeeks = currentDateTime.diff(commentDateTime, "weeks");
    if (differenceWeeks < 1) {
      return differenceDays === 1 ? "1 day ago" : `${differenceDays} days ago`;
    }

    const differenceMonths = currentDateTime.diff(commentDateTime, "months");
    if (differenceMonths < 1) {
      return differenceWeeks === 1
        ? "1 week ago"
        : `${differenceWeeks} weeks ago`;
    }

    const differenceYears = currentDateTime.diff(commentDateTime, "years");
    if (differenceYears < 1) {
      return differenceMonths === 1
        ? "1 month ago"
        : `${differenceMonths} months ago`;
    }

    return differenceYears === 1
      ? "1 year ago"
      : `${differenceYears} years ago`;
  }

  function handleButtonClick(comment: Comment) {
    setIsAddCommentCardVisible((currentValue) => !currentValue);
    onButtonClick(comment, addCommentCardType);
  }

  function handleEditClick() {
    setAddCommentCardType("UPDATE");
    setIsAddCommentCardVisible((currentValue) => !currentValue);
  }

  function handleReplyClick() {
    setAddCommentCardType("REPLY");
    setIsAddCommentCardVisible((currentValue) => !currentValue);
  }

  const isLargeDevice = useMemo(
    () => deviceType === "LAPTOP" || deviceType === "DESKTOP",
    [deviceType]
  );

  if (isLargeDevice) {
    return (
      <Container.Main>
        <Card alignItems="flex-start" horizontal>
          <Container.Score>
            <Icon.Plus onClick={onUpvoteClick} />
            <Text.Comment.Score>{score}</Text.Comment.Score>
            <Icon.Minus onClick={onDownvoteClick} />
          </Container.Score>
          <Container.Content>
            <Container.Top>
              <Container.Comment.Details>
                <Photo />
                <Text.Comment.Username>{username}</Text.Comment.Username>
                {userId === "me" && <Container.Me>You</Container.Me>}
                <Text.Comment.DateTimeDifference>
                  {getDateTimeDifferenceText()}
                </Text.Comment.DateTimeDifference>
              </Container.Comment.Details>
              <Container.Actions>
                {userId === "me" ? (
                  <>
                    <Text.Action.Delete onClick={onDeleteClick}>
                      <Icon.Delete />
                      Delete
                    </Text.Action.Delete>
                    <Text.Action.Edit onClick={handleEditClick}>
                      <Icon.Edit />
                      Edit
                    </Text.Action.Edit>
                  </>
                ) : (
                  <Text.Action.Reply onClick={handleReplyClick}>
                    <Icon.Reply />
                    Reply
                  </Text.Action.Reply>
                )}
              </Container.Actions>
            </Container.Top>
            <Text.Comment.Text>
              {parentId && (
                <Text.Comment.ReplyToUser>
                  @{replyToUser.username}&nbsp;
                </Text.Comment.ReplyToUser>
              )}
              {text}
            </Text.Comment.Text>
          </Container.Content>
        </Card>
        {isAddCommentCardVisible && (
          <AddCommentCard
            comment={comment}
            type={addCommentCardType}
            onButtonClick={handleButtonClick}
          />
        )}
      </Container.Main>
    );
  }

  return (
    <Container.Main>
      <Card>
        <Container.Top>
          <Photo />
          <Container.Username>
            <Text.Comment.Username>{username}</Text.Comment.Username>
            {userId === "me" && <Container.Me>You</Container.Me>}
          </Container.Username>
          <Text.Comment.DateTimeDifference>
            {getDateTimeDifferenceText()}
          </Text.Comment.DateTimeDifference>
        </Container.Top>
        <Text.Comment.Text>
          {parentId && (
            <Text.Comment.ReplyToUser>
              @{replyToUser.username}&nbsp;
            </Text.Comment.ReplyToUser>
          )}
          {text}
        </Text.Comment.Text>
        <Container.Bottom>
          <Container.Score>
            <Icon.Plus onClick={onUpvoteClick} />
            <Text.Comment.Score>{score}</Text.Comment.Score>
            <Icon.Minus onClick={onDownvoteClick} />
          </Container.Score>
          <Container.Actions>
            {userId === "me" ? (
              <>
                <Text.Action.Delete onClick={onDeleteClick}>
                  <Icon.Delete />
                  Delete
                </Text.Action.Delete>
                <Text.Action.Edit onClick={handleEditClick}>
                  <Icon.Edit />
                  Edit
                </Text.Action.Edit>
              </>
            ) : (
              <Text.Action.Reply onClick={handleReplyClick}>
                <Icon.Reply />
                Reply
              </Text.Action.Reply>
            )}
          </Container.Actions>
        </Container.Bottom>
      </Card>
      {isAddCommentCardVisible && (
        <AddCommentCard
          comment={comment}
          type={addCommentCardType}
          onButtonClick={handleButtonClick}
        />
      )}
    </Container.Main>
  );
}
