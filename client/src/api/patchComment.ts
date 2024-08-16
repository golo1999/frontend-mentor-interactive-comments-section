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
      Accept: "application/json",
      "Content-Type": "application/json",
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
      const existingComments = queryClient.getQueryData<Comment[]>("comments");
      let newComments: Comment[];

      // First-level comment
      if (!parentId) {
        newComments =
          existingComments?.map((existingComment) =>
            existingComment.id === id ? patchedComment : existingComment
          ) || [];
      } else {
        newComments =
          existingComments?.map((existingComment) => {
            if (existingComment.id === parentId) {
              return {
                ...existingComment,
                replies: existingComment.replies.map((existingReply) =>
                  existingReply.id === id ? patchedComment : existingReply
                ),
              };
            }

            return existingComment;
          }) || [];
      }

      queryClient.setQueryData<Comment[]>("comments", newComments);
    },
  });
}
