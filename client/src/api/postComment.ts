import { IPublicClientApplication } from "@azure/msal-browser";

import axios from "axios";
import { useQueryClient, useMutation } from "react-query";

import { Comment, CommentDTO } from "models";
import dayjs from "dayjs";

interface Props {
  commentDTO: CommentDTO;
  instance: IPublicClientApplication;
}

async function postCommentMutation({ commentDTO, instance }: Props) {
  const url = "https://localhost:7105/api/Comment";
  const { data } = await axios.post<Comment>(url, JSON.stringify(commentDTO), {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  return data;
}

export function usePostCommentMutation() {
  const queryClient = useQueryClient();

  return useMutation<Comment, Error, Props>({
    mutationFn: async ({ commentDTO, instance }) =>
      postCommentMutation({ commentDTO, instance }),
    onSuccess: (newComment, { commentDTO: { parentId } }) => {
      const existingComments = queryClient.getQueryData<Comment[]>("comments");
      let newComments: Comment[];

      // First-level comment
      if (!parentId) {
        newComments = existingComments
          ? [...existingComments, newComment].sort((comment1, comment2) => {
              const result = comment2.score - comment1.score;

              // If two comments have the same score, sorting by "dateTime" field
              if (result === 0) {
                return +dayjs(comment1.dateTime).isAfter(comment2.dateTime);
              }

              return result;
            })
          : [];
      } else {
        newComments =
          existingComments?.map((existingComment) => {
            if (existingComment.id === parentId) {
              return {
                ...existingComment,
                replies: [...existingComment.replies, newComment],
              };
            }

            return existingComment;
          }) || [];
      }

      queryClient.setQueryData<Comment[]>("comments", newComments);
    },
  });
}
