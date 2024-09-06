import { MdDarkMode, MdLightMode, MdLogout, MdMenu } from "react-icons/md";
import styled, { css } from "styled-components";

interface EndContainerProps {
  $vertical?: boolean;
}

export const Container = {
  End: styled.div<EndContainerProps>`
    align-items: center;
    display: flex;
    ${({ $vertical }) => $vertical && "flex-direction: column;"};
    gap: 4.26vw;

    @media screen {
      @media (min-width: 768px) {
        gap: 2.083vw;
      }

      @media (min-width: 1200px) {
        gap: 1.66vw;
      }
    }
  `,
  Main: styled.nav`
    align-items: center;
    background-color: ${({ theme }) => theme.colors.background.tertiary};
    border-radius: 2.13vw;
    display: flex;
    gap: 4.26vw;
    justify-content: space-between;
    padding: 4.26vw;

    @media screen {
      @media (min-width: 768px) {
        border-radius: 1.0416vw;
        gap: 2.083vw;
        padding: 2.083vw;
      }

      @media (min-width: 1200px) {
        border-radius: 0.55vw;
        gap: 1.66vw;
        padding: 1.66vw;
      }
    }
  `,
};

const sharedIconStyle = css`
  color: ${({ theme }) => theme.colors.icon.tertiary.default};
  cursor: pointer;
  transition: color 0.3s ease;
  height: 6.4vw;
  width: 6.4vw;

  &:hover {
    color: ${({ theme }) => theme.colors.icon.tertiary.hover};
  }

  @media screen {
    @media (min-width: 768px) {
      height: 3.125vw;
      width: 3.125vw;
    }

    @media (min-width: 1200px) {
      height: 1.94vw;
      width: 1.94vw;
    }
  }
`;

export const Icon = {
  Logout: styled(MdLogout)`
    ${sharedIconStyle};
  `,
  Menu: styled(MdMenu)`
    color: ${({ theme }) => theme.colors.icon.tertiary.default};
    height: 6.4vw;
    width: 6.4vw;

    &:hover {
      color: ${({ theme }) => theme.colors.icon.tertiary.hover};
    }
  `,
  Theme: {
    Dark: styled(MdDarkMode)`
      ${sharedIconStyle};
    `,
    Light: styled(MdLightMode)`
      ${sharedIconStyle};
    `,
  },
};

export const Text = {
  Option: styled.p`
    color: ${({ theme }) => theme.colors.text.navbar.option};
    font-size: 5.33vw;
  `,
  Title: styled.p`
    color: ${({ theme }) => theme.colors.text.navbar.title};
    font-size: 4.26vw;
    font-weight: 600;

    @media screen {
      @media (min-width: 768px) {
        font-size: 2.083vw;
      }

      @media (min-width: 1200px) {
        font-size: 1.38vw;
      }
    }
  `,
  User: {
    EmailAddress: styled.p`
      color: ${({ theme }) => theme.colors.text.navbar.user.emailAddress};
      font-size: 5.33vw;
      text-align: center;
    `,
  },
};
