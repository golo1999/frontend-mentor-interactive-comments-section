import { FaUser } from "react-icons/fa6";
import styled from "styled-components";

import { getColorValue } from "helpers";
import { User, UserWithToken } from "models";
import { Color } from "types";

interface MainContainerProps {
  $backgroundColor: Color;
  $color: Color;
}

const Container = {
  Main: styled.div<MainContainerProps>`
    align-items: center;
    background-color: ${({ $backgroundColor }) =>
      getColorValue($backgroundColor)};
    border-radius: 50%;
    color: ${({ $color }) => getColorValue($color)};
    cursor: pointer;
    display: flex;
    font-size: 3.46vw;
    height: 6.4vw;
    justify-content: center;
    user-select: none;
    width: 6.4vw;

    @media screen {
      @media (min-width: 768px) {
        font-size: 1.69vw;
        height: 3.125vw;
        width: 3.125vw;
      }

      @media (min-width: 1200px) {
        font-size: 1.04vw;
        height: 2.22vw;
        padding: 0.83vw;
        width: 2.22vw;
      }
    }
  `,
};

const Icon = {
  User: styled(FaUser)`
    height: 2.66vw;
    width: 2.66vw;

    @media screen {
      @media (min-width: 768px) {
        height: 1.3vw;
        width: 1.3vw;
      }

      @media (min-width: 1200px) {
        height: 0.83vw;
        width: 0.83vw;
      }
    }
  `,
};

interface Props {
  backgroundColor?: Color;
  textColor?: Color;
  user?: User | UserWithToken;
}

export function Avatar({
  backgroundColor = "VeryLightGray",
  textColor = "ModerateBlue",
  user,
}: Props) {
  if (!user) {
    return (
      <Container.Main $backgroundColor={backgroundColor} $color={textColor}>
        <Icon.User />
      </Container.Main>
    );
  }

  const { username } = user;

  const usernameInitial = username[0].toUpperCase();

  return (
    <Container.Main $backgroundColor={backgroundColor} $color={textColor}>
      {usernameInitial}
    </Container.Main>
  );
}
