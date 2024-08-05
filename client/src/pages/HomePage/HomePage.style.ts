import styled from "styled-components";

import { Colors } from "colors";

export const Container = {
  CommentCard: styled.div`
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
  CommentReplies: {
    Inner: styled.div`
      display: flex;
      flex-direction: column;
      flex: 1;
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
    Outer: styled.div`
      display: flex;
      gap: 4.26vw;

      @media screen {
        @media (min-width: 768px) {
          gap: 2.083vw;
          padding-left: 2.083vw;
        }

        @media (min-width: 1200px) {
          gap: 2.22vw;
          padding-left: 2.22vw;
        }
      }
    `,
  },
  Comments: styled.div`
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
    background-color: ${Colors.Neutral.VeryLightGray};
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 4.26vw;
    padding: 8.53vw 4.26vw;

    @media screen {
      @media (min-width: 768px) {
        gap: 2.083vw;
        padding: 4.16vw 10vw;
      }

      @media (min-width: 1200px) {
        gap: 1.11vw;
        padding: 4.44vw 26.5vw;
      }
    }
  `,
};

export const Line = styled.div`
  background-color: ${Colors.Neutral.LightGray};
  height: inherit;
  width: 0.53vw;

  @media screen {
    @media (min-width: 768px) {
      width: 0.26vw;
    }

    @media (min-width: 1200px) {
      width: 0.14vw;
    }
  }
`;
