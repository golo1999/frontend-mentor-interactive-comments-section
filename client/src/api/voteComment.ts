import { IPublicClientApplication } from "@azure/msal-browser";

import axios from "axios";
import { useQueryClient, useMutation } from "react-query";

import { Comment, PaginatedResult } from "models";
import { DEFAULT_PAGINATED_COMMENTS } from "mocks";
import { VoteType } from "types";

interface Props {
  id: string;
  instance: IPublicClientApplication;
  parentId?: string;
  voteType: VoteType;
}

async function voteCommentMutation({
  id,
  instance,
  parentId,
  voteType,
}: Props) {
  const url = !parentId
    ? `https://localhost:7105/api/Comment/${id}/vote?voteType=${voteType}`
    : `https://localhost:7105/api/Comment/${id}/vote?voteType=${voteType}&parentId=${parentId}`;
  const { data } = await axios.patch<Comment>(url, null, {
    headers: { Accept: "application/json" },
  });

  return data;
}

export function useVoteCommentMutation() {
  const queryClient = useQueryClient();

  return useMutation<Comment, Error, Props>({
    mutationFn: async ({ id, instance, parentId, voteType }) =>
      voteCommentMutation({ id, instance, parentId, voteType }),
    onSuccess: (updatedComment, { id, parentId }) => {
      const existingComments =
        queryClient.getQueryData<PaginatedResult<Comment>>("comments") ||
        DEFAULT_PAGINATED_COMMENTS;
      let updatedComments: PaginatedResult<Comment>;

      // First-level comment
      if (!parentId) {
        updatedComments = {
          ...existingComments,
          edges: existingComments.edges.map((edge) =>
            edge.cursor === id ? { ...edge, node: updatedComment } : edge
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
                    existingReply.id === id ? updatedComment : existingReply
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
