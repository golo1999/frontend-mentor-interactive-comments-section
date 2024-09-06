import { useMsal } from "@azure/msal-react";

import { useEffect } from "react";
import { createPortal } from "react-dom";

import { Avatar } from "components";
import { useDeviceType, useScrollLock } from "hooks";
import { useAuthenticatedUserStore, useSettingsStore } from "store";

import { Menu } from "./Menu";
import { Container, Icon, Text } from "./Navbar.style";

export function Navbar() {
  const { authenticatedUser } = useAuthenticatedUserStore();
  const { isMobileDevice } = useDeviceType();
  const { instance } = useMsal();
  const { lockScroll, unlockScroll } = useScrollLock();
  const {
    isNavbarMenuOpen,
    theme,
    changeTheme,
    closeNavbarMenu,
    openNavbarMenu,
  } = useSettingsStore();

  useEffect(() => {
    if (!isMobileDevice && isNavbarMenuOpen) {
      closeNavbarMenu();
    }
  }, [isMobileDevice, isNavbarMenuOpen, closeNavbarMenu]);

  function handleDarkModeClick() {
    changeTheme("LIGHT");
  }

  function handleLightModeClick() {
    changeTheme("DARK");
  }

  async function handleLogoutIconClick() {
    await instance.logoutPopup({ postLogoutRedirectUri: "/auth" });
    sessionStorage.removeItem("interactive-comments-section-home-account-id");

    if (isNavbarMenuOpen) {
      closeNavbarMenu();
    }
  }

  function handleMenuCloseClick() {
    unlockScroll();
    closeNavbarMenu();
  }

  function handleMenuOpenClick() {
    lockScroll();
    openNavbarMenu();
  }

  return (
    <>
      <Container.Main>
        <Text.Title>Frontend Mentor</Text.Title>
        <Container.End>
          {isMobileDevice ? (
            <Icon.Menu onClick={handleMenuOpenClick} />
          ) : (
            <>
              <Avatar user={authenticatedUser} />
              {theme === "DARK" ? (
                <Icon.Theme.Dark onClick={handleDarkModeClick} />
              ) : (
                <Icon.Theme.Light onClick={handleLightModeClick} />
              )}
              <Icon.Logout onClick={handleLogoutIconClick} />
            </>
          )}
        </Container.End>
      </Container.Main>
      {isMobileDevice &&
        createPortal(
          <Menu
            content={
              <Container.End $vertical>
                <Text.User.EmailAddress>
                  {authenticatedUser?.emailAddress}
                </Text.User.EmailAddress>
                {theme === "DARK" ? (
                  <Text.Option onClick={handleDarkModeClick}>
                    Dark Mode
                  </Text.Option>
                ) : (
                  <Text.Option onClick={handleLightModeClick}>
                    Light Mode
                  </Text.Option>
                )}
                <Text.Option onClick={handleLogoutIconClick}>
                  Sign out
                </Text.Option>
              </Container.End>
            }
            isOpen={isNavbarMenuOpen}
            onCloseClick={handleMenuCloseClick}
          />,
          document.body
        )}
    </>
  );
}
