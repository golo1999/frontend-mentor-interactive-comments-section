import { forwardRef, ReactNode } from "react";
import styled from "styled-components";

import { Colors } from "colors";
import { useSettingsStore } from "store";

interface OuterContainerProps {
  $scrollPosition: number;
}

const Container = {
  Inner: styled.div`
    background-color: ${Colors.Neutral.White};
    border-radius: 2.13vw;
    display: flex;
    flex-direction: column;
    gap: 4.26vw;
    margin: 4.26vw;
    padding: 6.4vw;

    @media screen {
      @media (min-width: 600px) {
        max-width: 60vw;
      }

      @media (min-width: 768px) {
        border-radius: 1.0416vw;
        gap: 2.083vw;
        margin: 2.083vw;
        max-width: 50vw;
        padding: 3.125vw;
      }

      @media (min-width: 1200px) {
        border-radius: 0.55vw;
        gap: 1.11vw;
        margin: 1.11vw;
        max-width: 25vw;
        padding: 2.22vw;
      }
    }
  `,
  Outer: styled.div<OuterContainerProps>`
    align-items: center;
    background-color: rgba(0, 0, 0, 0.75);
    display: flex;
    height: 100vh;
    justify-content: center;
    left: 0;
    position: absolute;
    top: ${({ $scrollPosition }) => $scrollPosition}px;
    width: 100vw;
    z-index: 9999;
  `,
};

interface Props {
  children: ReactNode;
}

export const Modal = forwardRef<HTMLDivElement, Props>(
  ({ children }, innerContainerRef) => {
    const { scrollPosition } = useSettingsStore();

    return (
      <Container.Outer $scrollPosition={scrollPosition}>
        <Container.Inner ref={innerContainerRef}>{children}</Container.Inner>
      </Container.Outer>
    );
  }
);
