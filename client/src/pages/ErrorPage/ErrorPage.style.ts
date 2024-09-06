import { MdError } from "react-icons/md";
import styled from "styled-components";

export const Container = {
  Content: styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    gap: 4.26vw;

    @media screen {
      @media (min-width: 768px) {
        gap: 2.083vw;
      }

      @media (min-width: 1200px) {
        gap: 1.11vw;
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

export const Icon = {
  Error: styled(MdError)`
    color: ${({ theme }) => theme.colors.icon.error};
    height: 25.6vw;
    width: 25.6vw;

    @media screen {
      @media (min-width: 768px) {
        height: 12.5vw;
        width: 12.5vw;
      }

      @media (min-width: 1200px) {
        height: 6.66vw;
        width: 6.66vw;
      }
    }
  `,
};

export const Text = {
  Description: styled.p`
    color: ${({ theme }) => theme.colors.text.error.description};
    font-size: 4.26vw;
    text-align: center;

    @media screen {
      @media (min-width: 768px) {
        font-size: 2.083vw;
      }

      @media (min-width: 1200px) {
        font-size: 1.11vw;
      }
    }
  `,
  Refresh: styled.span`
    cursor: pointer;
    text-decoration: underline;
  `,
  Title: styled.h2`
    color: ${({ theme }) => theme.colors.text.error.title};
    font-size: 6.4vw;
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
