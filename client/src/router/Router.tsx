import { useAccount, useIsAuthenticated, useMsal } from "@azure/msal-react";

import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { useGetUserByEmailAddressLazyQuery, usePostUserMutation } from "api";
import { ApiCallErrorType } from "enums";
import { AuthenticationPage, HomePage, LoadingPage, NotFoundPage } from "pages";
import { useAuthenticatedUserStore } from "store";

export function Router() {
  const { setAuthenticatedUser } = useAuthenticatedUserStore();
  const isAuthenticated = useIsAuthenticated();
  const { instance, inProgress } = useMsal();
  const homeAccountId =
    sessionStorage.getItem("interactive-comments-section-home-account-id") ||
    undefined;
  const account = useAccount({
    homeAccountId,
  });
  const { mutate: postUser } = usePostUserMutation();
  const [emailAddress, setEmailAddress] = useState("");
  const { data: fetchedUser, isSuccess: isFetchUserSuccessful } =
    useGetUserByEmailAddressLazyQuery({
      emailAddress,
      instance,
    });

  useEffect(() => {
    if (account && emailAddress !== account.username) {
      setEmailAddress(account.username);
    }
  }, [account, emailAddress]);

  useEffect(() => {
    if (!isFetchUserSuccessful) {
      return;
    }

    try {
      if (fetchedUser.entity) {
        setAuthenticatedUser(fetchedUser.entity);
      } else if (fetchedUser.error.type === ApiCallErrorType.ENTITY_NOT_FOUND) {
        const username = `${emailAddress.split("@")[0]}${dayjs().unix()}`;

        postUser(
          {
            instance,
            userDTO: {
              emailAddress,
              username,
            },
          },
          {
            onSuccess: (createdUser) => {
              if (createdUser.entity) {
                setAuthenticatedUser(createdUser.entity);
              }
            },
          }
        );
      }
    } catch (error) {
      console.log({ error });
    }
  }, [
    emailAddress,
    fetchedUser,
    instance,
    isFetchUserSuccessful,
    postUser,
    setAuthenticatedUser,
  ]);

  const authElement = isAuthenticated ? (
    <Navigate to="/" />
  ) : (
    <AuthenticationPage />
  );
  const rootElement = isAuthenticated ? <HomePage /> : <Navigate to="/auth" />;

  return (
    <>
      {inProgress !== "none" ? (
        <LoadingPage />
      ) : (
        <Routes>
          <Route element={rootElement} path="/" />
          <Route element={authElement} path="/auth" />
          <Route element={<NotFoundPage />} path="*" />
        </Routes>
      )}
    </>
  );
}
