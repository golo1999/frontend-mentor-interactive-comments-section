import { ReactNode } from "react";
import styled from "styled-components";

import { FlexAlignItems } from "types";

interface MainContainerProps {
  $alignItems?: FlexAlignItems;
  $horizontal: boolean;
}

const Container = {
  Main: styled.div<MainContainerProps>`
    ${({ $alignItems }) => $alignItems && `align-items: ${$alignItems};`};
    background-color: ${({ theme }) => theme.colors.background.secondary};
    border-radius: 2.13vw;
    display: flex;
    ${({ $horizontal }) => !$horizontal && "flex-direction: column;"};
    gap: 4.26vw;
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

interface Props {
  alignItems?: FlexAlignItems;
  children?: ReactNode;
  horizontal?: boolean;
}

export function Card({ alignItems, children, horizontal = false }: Props) {
  return (
    <Container.Main $alignItems={alignItems} $horizontal={horizontal}>
      {children}
    </Container.Main>
  );
}
