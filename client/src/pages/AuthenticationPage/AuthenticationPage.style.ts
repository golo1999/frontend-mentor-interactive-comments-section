import { SiFrontendmentor } from "react-icons/si";
import styled from "styled-components";

export const Button = styled.button.attrs({ type: "button" })`
  align-items: center;
  background-color: ${({ theme }) =>
    theme.colors.background.cta.secondary.default};
  color: ${({ theme }) => theme.colors.text.cta.secondary.default};
  border-radius: 5.33vw;
  display: flex;
  font-size: 4.26vw;
  font-weight: 600;
  gap: 3.2vw;
  padding: 3.2vw 5.33vw;
  user-select: none;
  width: fit-content;

  &:hover {
    background-color: ${({ theme }) =>
      theme.colors.background.cta.secondary.hover};
    color: ${({ theme }) => theme.colors.text.cta.secondary.hover};
  }

  @media screen {
    @media (min-width: 768px) {
      border-radius: 2.6vw;
      font-size: 2.083vw;
      gap: 1.5625vw;
      padding: 1.5625vw 2.6vw;
    }

    @media (min-width: 1200px) {
      border-radius: 1.38vw;
      font-size: 1.11vw;
      gap: 0.83vw;
      padding: 0.83vw 1.38vw;
    }
  }
`;

export const Container = {
  Logo: styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    gap: 6.4vw;

    @media screen {
      @media (min-width: 768px) {
        gap: 3.125vw;
      }

      @media (min-width: 1200px) {
        gap: 1.66vw;
      }
    }
  `,
  Main: {
    Inner: styled.div`
      align-items: center;
      display: flex;
      flex-direction: column;
      flex: 1;
      gap: 4.26vw;
      justify-content: space-between;
      width: 100%;

      @media screen {
        @media (min-width: 768px) {
          gap: 2.083vw;
        }

        @media (min-width: 1200px) {
          gap: 1.11vw;
        }
      }
    `,
    Outer: styled.div`
      align-items: center;
      background-color: ${({ theme }) => theme.colors.background.tertiary};
      display: flex;
      flex-direction: column;
      flex: 1;
      justify-content: center;
      padding: 17.06vw 4.26vw;

      @media screen {
        @media (min-width: 768px) {
          padding: 8.33vw 2.083vw;
        }

        @media (min-width: 1200px) {
          padding: 4.44vw 1.11vw;
        }
      }
    `,
  },
};

export const Icon = {
  FrontendMentor: styled(SiFrontendmentor)`
    aspect-ratio: 1 / 1;
    color: ${({ theme }) => theme.colors.icon.tertiary.default};
    font-size: 25.6vw;
    transition: color 0.3s ease;

    &:hover {
      color: ${({ theme }) => theme.colors.icon.tertiary.hover};
    }

    @media screen {
      @media (min-width: 768px) {
        font-size: 12.5vw;
      }

      @media (min-width: 1200px) {
        font-size: 6.66vw;
      }
    }
  `,
};

export const Text = {
  Title: styled.p`
    color: ${({ theme }) => theme.colors.text.navbar.title};
    font-size: 6.4vw;
    font-weight: 500;
    text-align: center;

    @media screen {
      @media (min-width: 768px) {
        font-size: 3.125vw;
      }

      @media (min-width: 1200px) {
        font-size: 1.66vw;
      }
    }
  `,
};
