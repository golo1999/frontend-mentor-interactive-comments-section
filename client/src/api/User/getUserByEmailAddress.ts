import { IPublicClientApplication } from "@azure/msal-browser";

import axios from "axios";
import { useQuery } from "react-query";

import { prepareToken } from "api";
import { User, ApiCallResult } from "models";

interface Props {
  emailAddress: string;
  instance: IPublicClientApplication;
}

async function getUser({ emailAddress, instance }: Props) {
  const url = `https://localhost:7105/api/User/email/${emailAddress}`;
  const token = await prepareToken(instance);
  const { data } = await axios.get<ApiCallResult<User>>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return data;
}

export function useGetUserByEmailAddressQuery({
  emailAddress,
  instance,
}: Props) {
  return useQuery<ApiCallResult<User>>({
    queryFn: async () => {
      return await getUser({ emailAddress, instance });
    },
  });
}

export function useGetUserByEmailAddressLazyQuery({
  emailAddress,
  instance,
}: Props) {
  return useQuery<ApiCallResult<User>>({
    queryKey: ["user", emailAddress],
    queryFn: async () => {
      return await getUser({ emailAddress, instance });
    },
    enabled: !!emailAddress,
  });
}
