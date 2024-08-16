import styled from "styled-components";

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
};
