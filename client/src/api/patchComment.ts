import { IPublicClientApplication } from "@azure/msal-browser";

import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

import { Comment, Operation } from "models";

interface Props {
  id: string;
  instance: IPublicClientApplication;
  operations: Operation[];
  parentId?: string;
}

async function patchCommentMutation({
  id,
  instance,
  operations,
  parentId,
}: Props) {
  const url = !parentId
    ? `https://localhost:7105/api/Comment/${id}`
    : `https://localhost:7105/api/Comment/${id}?parentId=${parentId}`;
  const { data } = await axios.patch<Comment>(url, JSON.stringify(operations), {
    headers: {
      Accept: "text/plain",
      "Content-Type": "application/json-patch+json",
    },
  });

  return data;
}

export function usePatchCommentMutation() {
  const queryClient = useQueryClient();

  return useMutation<Comment, Error, Props>({
    mutationFn: async ({ id, instance, operations, parentId }) =>
      patchCommentMutation({ id, instance, operations, parentId }),
    onSuccess: (patchedComment, { id, parentId }) => {
      const comments = queryClient.getQueryData<Comment[]>("comments");

      if (!parentId) {
        queryClient.setQueryData<Comment[]>(
          "comments",
          comments?.map((comment) => {
            if (comment.id === id) {
              return patchedComment;
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
                    return patchedComment;
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
