import { IPublicClientApplication } from "@azure/msal-browser";

import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

import { Comment, Operation, PaginatedResult } from "models";
import { DEFAULT_PAGINATED_COMMENTS } from "mocks";

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
      const existingComments =
        queryClient.getQueryData<PaginatedResult<Comment>>("comments") ||
        DEFAULT_PAGINATED_COMMENTS;
      let updatedComments: PaginatedResult<Comment>;

      // First-level comment
      if (!parentId) {
        updatedComments = {
          ...existingComments,
          edges: existingComments.edges.map((edge) =>
            edge.cursor === id ? { ...edge, node: patchedComment } : edge
          ),
        };
      } else {
        updatedComments = {
          ...existingComments,
          edges: existingComments.edges.map((edge) => {
            if (edge.cursor === parentId) {
              return {
                ...edge,
                node: {
                  ...edge.node,
                  replies: edge.node.replies.map((existingReply) =>
                    existingReply.id === id ? patchedComment : existingReply
                  ),
                },
              };
            }

            return edge;
          }),
        };
      }

      queryClient.setQueryData<PaginatedResult<Comment>>(
        "comments",
        updatedComments
      );
    },
  });
}
