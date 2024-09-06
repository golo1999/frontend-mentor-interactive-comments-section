import { useMsal } from "@azure/msal-react";

import { FaMicrosoft } from "react-icons/fa6";

import { loginRequest } from "api";

import { Button, Container, Icon, Text } from "./AuthenticationPage.style";

export function AuthenticationPage() {
  const { instance } = useMsal();

  async function handleAuthentication() {
    try {
      // Login logic using MSAL
      const loginResponse = await instance.loginPopup(loginRequest);

      sessionStorage.setItem(
        "interactive-comments-section-home-account-id",
        loginResponse.account.homeAccountId
      );
    } catch (error) {
      console.error(`Login failed: ${error}`);
    }
  }

  return (
    <Container.Main.Outer>
      <Container.Main.Inner>
        <div />
        <Container.Logo>
          <Icon.FrontendMentor />
          <Text.Title>Frontend Mentor</Text.Title>
        </Container.Logo>
        <Button onClick={handleAuthentication}>
          <FaMicrosoft /> Sign in with Microsoft
        </Button>
      </Container.Main.Inner>
    </Container.Main.Outer>
  );
}
