import { Comment, User } from "models";

export const COMMENTS: Comment[] = [
  {
    dateTime: "2024-06-07T17:32:05.4203629+00:00",
    id: "comment-0",
    replies: [],
    score: 2,
    text: "Impressive! Though it seems the drag feature could be improved. But overall it looks incredible. You've nailed the design and the responsiveness at various breakpoints works really well.",
    user: {
      emailAddress: "amyrobson@email.com",
      id: "6eb34ef1-018f-4c51-87c8-cab340dbdd26",
      username: "amyrobson",
    },
    userId: "user-0",
    votes: [
      { commentId: "comment-0", id: "vote-0", type: "UP", userId: "user-1" },
      { commentId: "comment-0", id: "vote-1", type: "UP", userId: "user-2" },
    ],
  },
  {
    dateTime: "2024-07-15T09:28:53.4203629+00:00",
    id: "comment-1",
    replies: [
      {
        dateTime: "2024-07-25T14:05:42.4203629+00:00",
        id: "comment-2",
        parentId: "comment-1",
        replies: [],
        replyToUser: {
          emailAddress: "maxblagun@email.com",
          id: "6eb34ef1-018f-4c51-87c8-cab340dbdd27",
          username: "maxblagun",
        },
        replyToUserId: "user-1",
        score: 1,
        text: "If you're still new, I'd recommend focusing on the fundamentals of HTML, CSS, and JS before considering React. It's very tempting to jump ahead but lay a solid foundation first.",
        user: {
          emailAddress: "ramsesmiron@email.com",
          id: "6eb34ef1-018f-4c51-87c8-cab340dbdd28",
          username: "ramsesmiron",
        },
        userId: "user-2",
        votes: [
          {
            commentId: "comment-2",
            id: "vote-3",
            parentCommentId: "comment-1",
            type: "UP",
            userId: "me",
          },
        ],
      },
      {
        dateTime: "2024-08-01T12:05:58.4203629+00:00",
        id: "comment-3",
        parentId: "comment-1",
        replies: [],
        replyToUser: {
          emailAddress: "ramsesmiron@email.com",
          id: "6eb34ef1-018f-4c51-87c8-cab340dbdd28",
          username: "ramsesmiron",
        },
        replyToUserId: "user-2",
        score: 0,
        text: "I couldn't agree more with this. Everything moves so fast and it always seems like everyone knows the newest library/framework. But the fundamentals are what stay constant.",
        user: {
          emailAddress: "me@email.com",
          id: "6eb34ef1-018f-4c51-87c8-cab340dbdd25",
          username: "me",
        },
        userId: "me",
        votes: [],
      },
    ],
    score: -1,
    text: "Woah, your project looks awesome! How long have you been coding for? I'm still new, but think I want to dive into React as well soon. Perhaps you can give me an insight on where I can learn React? Thanks!",
    user: {
      emailAddress: "maxblagun@email.com",
      id: "6eb34ef1-018f-4c51-87c8-cab340dbdd27",
      username: "maxblagun",
    },
    userId: "user-1",
    votes: [
      {
        commentId: "comment-1",
        id: "vote-2",
        type: "DOWN",
        userId: "me",
      },
    ],
  },
];

export const USERS: User[] = [
  {
    emailAddress: "me@email.com",
    id: "6eb34ef1-018f-4c51-87c8-cab340dbdd25",
    username: "me",
  },
  {
    emailAddress: "amyrobson@email.com",
    id: "6eb34ef1-018f-4c51-87c8-cab340dbdd26",
    username: "amyrobson",
  },
  {
    emailAddress: "maxblagun@email.com",
    id: "6eb34ef1-018f-4c51-87c8-cab340dbdd27",
    username: "maxblagun",
  },
  {
    emailAddress: "ramsesmiron@email.com",
    id: "6eb34ef1-018f-4c51-87c8-cab340dbdd28",
    username: "ramsesmiron",
  },
];
