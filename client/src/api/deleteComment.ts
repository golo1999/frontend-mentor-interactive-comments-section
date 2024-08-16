import { IPublicClientApplication } from "@azure/msal-browser";

import axios from "axios";
import { useQueryClient, useMutation } from "react-query";

import { Comment } from "models";

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
      const existingComments = queryClient.getQueryData<Comment[]>("comments");
      let newComments: Comment[];

      // First-level comment
      if (!parentId) {
        newComments =
          existingComments?.filter(
            (existingComment) => existingComment.id !== id
          ) || [];
      } else {
        newComments =
          existingComments?.map((existingComment) => {
            if (existingComment.id === parentId) {
              return {
                ...existingComment,
                replies: existingComment.replies.filter(
                  (existingReply) => existingReply.id !== id
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
