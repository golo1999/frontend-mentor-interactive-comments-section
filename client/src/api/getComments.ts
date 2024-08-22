import { IPublicClientApplication } from "@azure/msal-browser";

import axios from "axios";
import { useQuery, useQueryClient } from "react-query";

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
  const { data } = await axios.get<PaginatedResult<Comment>>(url, {
    headers: {
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
