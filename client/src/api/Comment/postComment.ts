import { IPublicClientApplication } from "@azure/msal-browser";

import axios from "axios";
import dayjs from "dayjs";
import { useQueryClient, useMutation } from "react-query";

import { prepareToken } from "api";
import { ApiCallResult, Comment, CommentDTO, PaginatedResult } from "models";
import { DEFAULT_PAGINATED_COMMENTS } from "mocks";

interface Props {
  commentDTO: CommentDTO;
  instance: IPublicClientApplication;
}

async function postCommentMutation({ commentDTO, instance }: Props) {
  const url = "https://localhost:7105/api/Comment";
  const token = await prepareToken(instance);
  const { data } = await axios.post<ApiCallResult<Comment>>(
    url,
    JSON.stringify(commentDTO),
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

export function usePostCommentMutation() {
  const queryClient = useQueryClient();

  return useMutation<ApiCallResult<Comment>, Error, Props>({
    mutationFn: async ({ commentDTO, instance }) =>
      postCommentMutation({ commentDTO, instance }),
    onSuccess: (apiResult, { commentDTO: { parentId } }) => {
      if (apiResult.error) {
        return;
      }

      const existingComments =
        queryClient.getQueryData<PaginatedResult<Comment>>("comments") ||
        DEFAULT_PAGINATED_COMMENTS;

      let updatedComments: PaginatedResult<Comment>;

      // First-level comment
      if (!parentId) {
        const updatedEdges = [
          ...existingComments.edges,
          { cursor: apiResult.entity.id, node: apiResult.entity },
        ].sort(({ node: comment1 }, { node: comment2 }) => {
          const result = comment2.score - comment1.score;

          // If two comments have the same score, sorting by "dateTime" field
          if (result === 0) {
            return +dayjs(comment1.dateTime).isAfter(comment2.dateTime);
          }

          return result;
        });

        updatedComments = {
          ...existingComments,
          edges: updatedEdges,
          pageInfo: {
            ...existingComments.pageInfo,
            endCursor: updatedEdges[updatedEdges.length - 1].cursor,
          },
          totalCount: existingComments.totalCount + 1,
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
                  replies: [...edge.node.replies, apiResult.entity],
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
