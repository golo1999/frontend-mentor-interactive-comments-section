import { IoIosArrowUp } from "react-icons/io";
import styled from "styled-components";

import { Colors } from "colors";

interface ButtonProps {
  $isVisible: boolean;
}

const Button = styled.button.attrs({ type: "button" })<ButtonProps>`
  align-items: center;
  background-color: ${Colors.Neutral.DarkBlue};
  border-radius: 50%;
  bottom: 4.26vw;
  color: ${Colors.Neutral.White};
  display: flex;
  justify-content: center;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  padding: 3.2vw;
  position: fixed;
  right: 4.26vw;
  transition: opacity 0.3s ease;
  width: fit-content;

  &:hover {
    background-color: ${Colors.Neutral.GrayishBlue};
    color: ${Colors.Neutral.VeryLightGray};
  }

  @media screen {
    @media (min-width: 768px) {
      bottom: 2.083vw;
      padding: 1.5625vw;
      right: 10vw;
    }

    @media (min-width: 1200px) {
      bottom: 2.22vw;
      padding: 1.11vw;
      right: 26.5vw;
    }
  }
`;

const Icon = styled(IoIosArrowUp)`
  height: 4.8vw;
  width: 4.8vw;

  @media screen {
    @media (min-width: 768px) {
      height: 2.34375vw;
      width: 2.34375vw;
    }

    @media (min-width: 1200px) {
      height: 1.66vw;
      width: 1.66vw;
    }
  }
`;

interface Props {
  isVisible: boolean;
  onClick: () => void;
}

export function ScrollButton({ isVisible, onClick }: Props) {
  return (
    <Button $isVisible={isVisible} onClick={isVisible ? onClick : undefined}>
      <Icon />
    </Button>
  );
}
