import { IPublicClientApplication } from "@azure/msal-browser";

import axios from "axios";
import { useQueryClient, useMutation } from "react-query";

import { Comment, PaginatedResult } from "models";
import { DEFAULT_PAGINATED_COMMENTS } from "mocks";

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
      Accept: "application/json",
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
      const existingComments =
        queryClient.getQueryData<PaginatedResult<Comment>>("comments") ||
        DEFAULT_PAGINATED_COMMENTS;
      let updatedComments: PaginatedResult<Comment>;

      // First-level comment
      if (!parentId) {
        const updatedEdges = existingComments.edges.filter(
          ({ cursor }) => cursor !== id
        );

        updatedComments = {
          ...existingComments,
          edges: updatedEdges,
          pageInfo: {
            ...existingComments.pageInfo,
            endCursor: updatedEdges[updatedEdges.length - 1].cursor,
          },
          totalCount: existingComments.totalCount - 1,
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
                  replies: edge.node.replies.filter(
                    (existingReply) => existingReply.id !== id
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
