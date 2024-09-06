import { ReactNode } from "react";
import { MdClose } from "react-icons/md";
import styled from "styled-components";

interface MainContainerProps {
  $isOpen: boolean;
}

const Container = {
  Main: styled.div<MainContainerProps>`
    align-items: center;
    background-color: ${({ theme }) => theme.colors.background.tertiary};
    display: flex;
    inset: 0;
    justify-content: center;
    opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
    padding: 4.26vw;
    ${({ $isOpen }) => !$isOpen && "pointer-events: none;"};
    position: fixed;
    transition: opacity 0.6s ease;
    z-index: 9999;
  `,
};

const Icon = {
  Close: styled(MdClose)`
    color: ${({ theme }) => theme.colors.icon.primary.default};
    height: 8.53vw;
    position: fixed;
    right: 8.53vw;
    top: 8.53vw;
    width: 8.53vw;
  `,
};

interface Props {
  content: ReactNode;
  isOpen: boolean;
  onCloseClick: () => void;
}

export function Menu({ content, isOpen, onCloseClick }: Props) {
  return (
    <Container.Main $isOpen={isOpen}>
      <Icon.Close onClick={onCloseClick} />
      {content}
    </Container.Main>
  );
}
