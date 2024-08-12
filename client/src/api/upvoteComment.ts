import { IPublicClientApplication } from "@azure/msal-browser";

import axios from "axios";
import { useQueryClient, useMutation } from "react-query";

import { Comment } from "models";

interface Props {
  id: string;
  instance: IPublicClientApplication;
  parentId?: string;
}

async function upvoteCommentMutation({ id, instance, parentId }: Props) {
  const url = !parentId
    ? `https://localhost:7105/api/Comment/${id}/UP`
    : `https://localhost:7105/api/Comment/${id}/UP?parentId=${parentId}`;
  const { data } = await axios.patch<Comment>(url, null, {
    headers: { Accept: "text/plain" },
  });

  return data;
}

export function useUpvoteCommentMutation() {
  const queryClient = useQueryClient();

  return useMutation<Comment, Error, Props>({
    mutationFn: async ({ id, instance, parentId }) =>
      upvoteCommentMutation({ id, instance, parentId }),
    onSuccess: (updatedComment, { id, parentId }) => {
      const comments = queryClient.getQueryData<Comment[]>("comments");

      if (!parentId) {
        queryClient.setQueryData<Comment[]>(
          "comments",
          comments?.map((comment) => {
            if (comment.id === id) {
              return updatedComment;
            }

            return comment;
          }) || []
        );
      } else {
        queryClient.setQueryData<Comment[]>(
          "comments",
          comments?.map((comment) => {
            if (comment.id === parentId) {
              return {
                ...comment,
                replies: comment.replies.map((reply) => {
                  if (reply.id === id) {
                    return updatedComment;
                  }

                  return reply;
                }),
              };
            }

            return comment;
          }) || []
        );
      }
    },
  });
}
