import { IPublicClientApplication } from "@azure/msal-browser";

import axios from "axios";
import { useQuery } from "react-query";

import { Comment } from "models";

async function getComments(instance: IPublicClientApplication) {
  const url = "https://localhost:7105/api/Comment/all";
  const { data } = await axios.get<Comment[]>(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return data;
}

export function useGetCommentsQuery(instance: IPublicClientApplication) {
  return useQuery("comments", {
    queryFn: async () => {
      const responseData = await getComments(instance);
      return responseData;
    },
  });
}
