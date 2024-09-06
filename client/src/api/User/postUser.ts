import { IPublicClientApplication } from "@azure/msal-browser";

import axios from "axios";
import { useMutation } from "react-query";

import { prepareToken } from "api";
import { ApiCallResult, User, UserDTO } from "models";

interface Props {
  userDTO: UserDTO;
  instance: IPublicClientApplication;
}

async function postUserMutation({ userDTO, instance }: Props) {
  const url = "https://localhost:7105/api/User";
  const token = await prepareToken(instance);
  const { data } = await axios.post<ApiCallResult<User>>(
    url,
    JSON.stringify(userDTO),
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

export function usePostUserMutation() {
  return useMutation<ApiCallResult<User>, Error, Props>({
    mutationFn: async ({ instance, userDTO }) =>
      postUserMutation({ instance, userDTO }),
  });
}
