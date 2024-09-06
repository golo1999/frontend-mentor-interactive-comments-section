import { IPublicClientApplication } from "@azure/msal-browser";

import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

import { prepareToken } from "api";
import { ApiCallResult, Comment, Operation, PaginatedResult } from "models";
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
  const token = await prepareToken(instance);
  const { data } = await axios.patch<ApiCallResult<Comment>>(
    url,
    JSON.stringify(operations),
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return data;
}

export function usePatchCommentMutation() {
  const queryClient = useQueryClient();

  return useMutation<ApiCallResult<Comment>, Error, Props>({
    mutationFn: async ({ id, instance, operations, parentId }) =>
      patchCommentMutation({ id, instance, operations, parentId }),
    onSuccess: (apiResult, { id, parentId }) => {
      if (apiResult.error) {
        return;
      }

      const existingComments =
        queryClient.getQueryData<PaginatedResult<Comment>>("comments") ||
        DEFAULT_PAGINATED_COMMENTS;

      let updatedComments: PaginatedResult<Comment>;

      // First-level comment
      if (!parentId) {
        updatedComments = {
          ...existingComments,
          edges: existingComments.edges.map((edge) =>
            edge.cursor === id ? { ...edge, node: apiResult.entity } : edge
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
                    existingReply.id === id ? apiResult.entity : existingReply
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
