import { Comment, User } from "models";

export const COMMENTS: Comment[] = [
  {
    dateTime: "2024-06-07T17:32:05.000Z",
    id: "comment-0",
    replies: [],
    score: 2,
    text: "Impressive! Though it seems the drag feature could be improved. But overall it looks incredible. You've nailed the design and the responsiveness at various breakpoints works really well.",
    user: { id: "user-0", username: "amyrobson" },
    userId: "user-0",
    votes: [
      { commentId: "comment-0", id: "vote-0", type: "UP", userId: "user-1" },
      { commentId: "comment-0", id: "vote-1", type: "UP", userId: "user-2" },
    ],
  },
  {
    dateTime: "2024-07-15T09:28:53.000Z",
    id: "comment-1",
    replies: [
      {
        dateTime: "2024-07-25T14:05:42.000Z",
        id: "comment-2",
        parentId: "comment-1",
        replies: [],
        replyToUser: { id: "user-1", username: "maxblagun" },
        replyToUserId: "user-1",
        score: 1,
        text: "If you're still new, I'd recommend focusing on the fundamentals of HTML, CSS, and JS before considering React. It's very tempting to jump ahead but lay a solid foundation first.",
        user: { id: "user-2", username: "ramsesmiron" },
        userId: "user-2",
        votes: [
          {
            commentId: "comment-2",
            id: "vote-3",
            type: "UP",
            userId: "me",
          },
        ],
      },
      {
        dateTime: "2024-08-01T12:05:58.000Z",
        id: "comment-3",
        parentId: "comment-1",
        replies: [],
        replyToUser: { id: "user-2", username: "ramsesmiron" },
        replyToUserId: "user-2",
        score: 0,
        text: "I couldn't agree more with this. Everything moves so fast and it always seems like everyone knows the newest library/framework. But the fundamentals are what stay constant.",
        user: { id: "me", username: "me" },
        userId: "me",
        votes: [],
      },
    ],
    score: -1,
    text: "Woah, your project looks awesome! How long have you been coding for? I'm still new, but think I want to dive into React as well soon. Perhaps you can give me an insight on where I can learn React? Thanks!",
    user: { id: "user-1", username: "maxblagun" },
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
  { id: "me", username: "me" },
  { id: "user-0", username: "amyrobson" },
  { id: "user-1", username: "maxblagun" },
  { id: "user-2", username: "ramsesmiron" },
];
