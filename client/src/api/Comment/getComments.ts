import { IPublicClientApplication } from "@azure/msal-browser";

import axios from "axios";
import { useQuery, useQueryClient } from "react-query";

import { prepareToken } from "api";
import { Comment, PaginatedResult } from "models";
import { DEFAULT_PAGINATED_COMMENTS } from "mocks";

interface Props {
  after?: string;
  first: number;
  instance: IPublicClientApplication;
}

async function getComments({ after, first, instance }: Props) {
  const url = !after
    ? `https://localhost:7105/api/Comment/all/paginated?first=${first}`
    : `https://localhost:7105/api/Comment/all/paginated?first=${first}&after=${after}`;
  const token = await prepareToken(instance);
  const { data } = await axios.get<PaginatedResult<Comment>>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return data;
}

export function useGetCommentsQuery({ after, first, instance }: Props) {
  const queryClient = useQueryClient();

  return useQuery<PaginatedResult<Comment>>(
    ["comments", { after, first }],
    async () => getComments({ after, first, instance }),
    {
      keepPreviousData: true,
      onSuccess: (paginatedResult) => {
        const existingComments =
          queryClient.getQueryData<PaginatedResult<Comment>>("comments") ||
          DEFAULT_PAGINATED_COMMENTS;
        // Checking if the existingComments already contain any new comment
        // If so, removing the intersection items from existingComments
        // e.g: when adding a comment and the list has more comments to fetch
        const intersection = new Set(
          existingComments.edges.filter((existingEdge) =>
            paginatedResult.edges.some(
              (paginatedEdge) => paginatedEdge.cursor === existingEdge.cursor
            )
          )
        );

        if (intersection.size > 0) {
          existingComments.edges = existingComments.edges.filter(
            (edge) => !intersection.has(edge)
          );
          existingComments.totalCount =
            existingComments.totalCount - intersection.size;
        }

        const updatedComments: PaginatedResult<Comment> = {
          ...paginatedResult,
          edges: [...existingComments.edges, ...paginatedResult.edges],
          totalCount: existingComments.totalCount + paginatedResult.totalCount,
        };

        queryClient.setQueryData<PaginatedResult<Comment>>(
          "comments",
          updatedComments
        );
      },
    }
  );
}
