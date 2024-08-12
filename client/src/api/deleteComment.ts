import { IPublicClientApplication } from "@azure/msal-browser";

import axios from "axios";
import { useQueryClient, useMutation } from "react-query";

import { Comment } from "models";

interface DeleteCommentContext {
  comments?: Comment[];
}

interface Props {
  id: string;
  instance: IPublicClientApplication;
  parentId?: string;
}

async function deleteCommentMutation({ id, instance, parentId }: Props) {
  const url = !parentId
    ? `https://localhost:7105/api/Comment/${id}`
    : `https://localhost:7105/api/Comment/${id}?parentId=${parentId}`;
  const { data } = await axios.delete<Comment>(url, {
    headers: {
      Accept: "text/plain",
    },
  });

  return data;
}

export function useDeleteCommentMutation() {
  const queryClient = useQueryClient();

  return useMutation<Comment, Error, Props, DeleteCommentContext>({
    mutationFn: async ({ id, instance, parentId }) =>
      deleteCommentMutation({ id, instance, parentId }),
    onSuccess: (deletedComment, { id, parentId }) => {
      const comments = queryClient.getQueryData<Comment[]>("comments");

      if (!parentId) {
        queryClient.setQueryData<Comment[]>(
          "comments",
          comments?.filter((comment) => comment.id !== id) || []
        );
      } else {
        queryClient.setQueryData<Comment[]>(
          "comments",
          comments?.map((comment) => {
            if (comment.id === parentId) {
              return {
                ...comment,
                replies: comment.replies.filter((reply) => reply.id !== id),
              };
            }

            return comment;
          }) || []
        );
      }
    },
  });
}
