import { IPublicClientApplication } from "@azure/msal-browser";

import axios from "axios";
import { useQueryClient, useMutation } from "react-query";

import { Comment, CommentDTO } from "models";

interface Props {
  commentDTO: CommentDTO;
  instance: IPublicClientApplication;
}

async function postCommentMutation({ commentDTO, instance }: Props) {
  const url = "https://localhost:7105/api/Comment";
  const { data } = await axios.post<Comment>(url, JSON.stringify(commentDTO), {
    headers: {
      Accept: "text/plain",
      "Content-Type": "application/json-patch+json",
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
      const comments = queryClient.getQueryData<Comment[]>("comments");

      if (!parentId) {
        const newComments = comments
          ? [...comments, newComment].sort(
              (comment1, comment2) => comment2.score - comment1.score
            )
          : [];

        queryClient.setQueryData<Comment[]>("comments", newComments);
      } else {
        queryClient.setQueryData<Comment[]>(
          "comments",
          comments?.map((comment) => {
            if (comment.id === parentId) {
              return {
                ...comment,
                replies: [...comment.replies, newComment],
              };
            }

            return comment;
          }) || []
        );
      }
    },
  });
}
