import styled from "styled-components";

export const Button = styled.button.attrs({ type: "button" })`
  background-color: ${({ theme }) =>
    theme.colors.background.cta.primary.default};
  border-radius: 2.13vw;
  color: ${({ theme }) => theme.colors.text.cta.primary.default};
  cursor: ${({ disabled }) => (disabled ? "no-drop" : "pointer")};
  font-size: 3.46vw;
  font-weight: 600;
  padding: 3.2vw 6.4vw;
  text-transform: uppercase;

  &:hover {
    ${({ disabled, theme }) =>
      !disabled &&
      `background-color: ${theme.colors.background.cta.primary.hover};`};
    ${({ disabled, theme }) =>
      !disabled && `color: ${theme.colors.text.cta.primary.hover};`};
  }

  @media screen {
    @media (min-width: 768px) {
      border-radius: 1.0416vw;
      font-size: 1.7vw;
      padding: 1.5625vw 3.125vw;
    }

    @media (min-width: 1200px) {
      border-radius: 0.55vw;
      font-size: 0.9vw;
      order: 3;
      padding: 0.83vw 1.66vw;
    }
  }
`;

export const Container = {
  Bottom: styled.div`
    align-items: center;
    display: flex;
    gap: 4.26vw;
    justify-content: space-between;

    @media screen {
      @media (min-width: 768px) {
        gap: 2.083vw;
      }

      @media (min-width: 1200px) {
        gap: 1.11vw;
      }
    }
  `,
};

export const TextArea = styled.textarea`
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: 2.13vw;
  border: 0.26vw solid ${({ theme }) => theme.colors.border.primary};
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  font-size: 4.26vw;
  padding: 2.13vw 4.26vw;
  resize: none;

  &:hover {
    border-color: ${({ theme }) => theme.colors.border.secondary};
  }

  @media screen {
    @media (min-width: 768px) {
      border-radius: 1.0416vw;
      border-width: 0.13vw;
      font-size: 2.083vw;
      padding: 1.0416vw 2.083vw;
    }

    @media (min-width: 1200px) {
      border-radius: 0.55vw;
      border-width: 0.07vw;
      flex: 1;
      font-size: 1.11vw;
      order: 2;
      padding: 0.55vw 1.11vw;
    }
  }
`;
