import styled from "styled-components";

export const Button = styled.button.attrs({ type: "button" })`
  background-color: ${({ theme }) =>
    theme.colors.background.cta.primary.default};
  border-radius: 5.33vw;
  color: ${({ theme }) => theme.colors.text.cta.primary.default};
  cursor: pointer;
  font-size: 3.73vw;
  padding: 3.2vw 5.33vw;
  text-transform: uppercase;
  transition: background-color 0.3s ease, color 0.3s ease;
  width: fit-content;

  &:hover {
    background-color: ${({ theme }) =>
      theme.colors.background.cta.primary.hover};
    color: ${({ theme }) => theme.colors.text.cta.primary.hover};
  }

  @media screen {
    @media (min-width: 768px) {
      border-radius: 2.6vw;
      font-size: 1.82vw;
      padding: 1.5625vw 2.6vw;
    }

    @media (min-width: 1200px) {
      border-radius: 1.38vw;
      font-size: 0.97vw;
      padding: 0.83vw 1.38vw;
    }
  }
`;

export const Container = {
  Content: styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    gap: 4.26vw;
    text-align: center;

    @media screen {
      @media (min-width: 768px) {
        gap: 2.083vw;
      }

      @media (min-width: 1200px) {
        gap: 1.38vw;
      }
    }
  `,
  Main: styled.div`
    align-items: center;
    background-color: ${({ theme }) => theme.colors.background.primary};
    display: flex;
    flex: 1;
    justify-content: center;
    padding: 8.53vw 4.26vw;

    @media screen {
      @media (min-width: 768px) {
        padding: 4.16vw 10vw;
      }

      @media (min-width: 1200px) {
        padding: 4.44vw 26.5vw;
      }
    }
  `,
};

interface TitleChildProps {
  $isParentHovered: boolean;
}

export const Text = {
  Description: styled.p`
    color: ${({ theme }) => theme.colors.text.notFound.description};
    font-size: 4.26vw;

    @media screen {
      @media (min-width: 768px) {
        font-size: 2.34375vw;
      }

      @media (min-width: 1200px) {
        font-size: 1.11vw;
      }
    }
  `,
  Subtitle: styled.h3`
    color: ${({ theme }) => theme.colors.text.notFound.subtitle};
    font-size: 5.86vw;
    text-transform: uppercase;

    @media screen {
      @media (min-width: 768px) {
        font-size: 3.64vw;
      }

      @media (min-width: 1200px) {
        font-size: 1.53vw;
      }
    }
  `,
  Title: {
    Child: styled.span<TitleChildProps>`
      ${({ $isParentHovered }) =>
        $isParentHovered && "transform: rotateX(180deg);"};
      transition: transform 1s ease;
    `,
    Parent: styled.h1`
      color: ${({ theme }) => theme.colors.text.notFound.title};
      display: flex;
      cursor: default;
      font-size: 19.2vw;

      @media screen {
        @media (min-width: 768px) {
          font-size: 12.5vw;
        }

        @media (min-width: 1200px) {
          font-size: 10vw;
        }
      }
    `,
  },
};
