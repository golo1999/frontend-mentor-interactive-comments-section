import { IPublicClientApplication } from "@azure/msal-browser";

import axios from "axios";
import { useQueryClient, useMutation } from "react-query";

import { Comment } from "models";
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
      const existingComments = queryClient.getQueryData<Comment[]>("comments");
      let newComments: Comment[];

      // First-level comment
      if (!parentId) {
        newComments =
          existingComments?.map((existingComment) =>
            existingComment.id === id ? updatedComment : existingComment
          ) || [];
      } else {
        newComments =
          existingComments?.map((existingComment) => {
            if (existingComment.id === parentId) {
              return {
                ...existingComment,
                replies: existingComment.replies.map((existingReply) =>
                  existingReply.id === id ? updatedComment : existingReply
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
