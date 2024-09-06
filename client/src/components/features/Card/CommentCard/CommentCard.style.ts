import { FaMinus, FaPencil, FaPlus, FaReply, FaTrash } from "react-icons/fa6";
import styled, { css } from "styled-components";

export const Container = {
  Actions: styled.div`
    align-items: center;
    display: flex;
    gap: 4.26vw;

    @media screen {
      @media (min-width: 768px) {
        gap: 2.083vw;
      }

      @media (min-width: 1200px) {
        gap: 1.66vw;
      }
    }
  `,
  Bottom: styled.div`
    align-items: center;
    display: flex;
    justify-content: space-between;
  `,
  Comment: {
    Details: styled.div`
      align-items: center;
      display: flex;
      gap: 3.2vw;

      @media screen {
        @media (min-width: 768px) {
          gap: 1.5625vw;
        }

        @media (min-width: 1200px) {
          gap: 0.83vw;
        }
      }
    `,
  },
  Content: styled.div`
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
  Main: styled.div`
    display: flex;
    flex-direction: column;
    gap: 2.13vw;

    @media screen {
      @media (min-width: 768px) {
        gap: 1.0416vw;
      }

      @media (min-width: 1200px) {
        gap: 0.55vw;
      }
    }
  `,
  Me: styled.div`
    background-color: ${({ theme }) => theme.colors.background.me};
    border-radius: 0.53vw;
    color: ${({ theme }) => theme.colors.text.me};
    font-size: 3.46vw;
    font-weight: 600;
    padding: 0.8vw 1.6vw;
    text-transform: lowercase;
    user-select: none;

    @media screen {
      @media (min-width: 768px) {
        border-radius: 0.26vw;
        font-size: 1.7vw;
        padding: 0.390625vw 0.78125vw;
      }

      @media (min-width: 1200px) {
        border-radius: 0.14vw;
        font-size: 0.9vw;
        padding: 0.2083vw 0.416vw;
      }
    }
  `,
  Score: styled.div`
    align-items: center;
    background-color: ${({ theme }) => theme.colors.background.quaternary};
    border-radius: 2.13vw;
    display: flex;
    gap: 3.2vw;
    padding: 2.13vw 4.26vw;
    user-select: none;

    @media screen {
      @media (min-width: 768px) {
        border-radius: 1.0416vw;
        gap: 1.5625vw;
        padding: 1.5625vw;
      }

      @media (min-width: 1200px) {
        border-radius: 0.55vw;
        flex-direction: column;
        gap: 0.83vw;
        padding: 0.83vw;
      }
    }
  `,
  Top: styled.div`
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 2.13vw 4.26vw;

    @media screen {
      @media (min-width: 768px) {
        gap: 2.083vw;
      }

      @media (min-width: 1200px) {
        justify-content: space-between;
        gap: 1.11vw;
      }
    }
  `,
  Username: styled.div`
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 2.13vw;

    @media screen {
      @media (min-width: 768px) {
        gap: 1.0416vw;
      }

      @media (min-width: 1200px) {
        gap: 0.55vw;
      }
    }
  `,
};

interface ScoreIconProps {
  $isDisabled: boolean;
}

export const Icon = {
  Delete: styled(FaTrash)`
    font-size: 3.73vw;

    @media screen {
      @media (min-width: 768px) {
        font-size: 1.82vw;
      }

      @media (min-width: 1200px) {
        font-size: 0.97vw;
      }
    }
  `,
  Edit: styled(FaPencil)`
    font-size: 3.73vw;

    @media screen {
      @media (min-width: 768px) {
        font-size: 1.82vw;
      }

      @media (min-width: 1200px) {
        font-size: 0.97vw;
      }
    }
  `,
  Minus: styled(FaMinus)<ScoreIconProps>`
    color: ${({ theme }) => theme.colors.icon.secondary.default};
    ${({ $isDisabled }) => !$isDisabled && "cursor: pointer;"};
    font-size: 3.2vw;
    transition: color 0.3s ease;

    &:hover {
      ${({ $isDisabled, theme }) =>
        !$isDisabled && `color: ${theme.colors.icon.secondary.hover};`};
    }

    @media screen {
      @media (min-width: 768px) {
        font-size: 1.5625vw;
      }

      @media (min-width: 1200px) {
        font-size: 0.97vw;
      }
    }
  `,
  Plus: styled(FaPlus)<ScoreIconProps>`
    color: ${({ theme }) => theme.colors.icon.secondary.default};
    ${({ $isDisabled }) => !$isDisabled && "cursor: pointer;"};
    font-size: 3.2vw;
    transition: color 0.3s ease;

    &:hover {
      ${({ $isDisabled, theme }) =>
        !$isDisabled && `color: ${theme.colors.icon.secondary.hover};`};
    }

    @media screen {
      @media (min-width: 768px) {
        font-size: 1.5625vw;
      }

      @media (min-width: 1200px) {
        font-size: 0.97vw;
      }
    }
  `,
  Reply: styled(FaReply)`
    font-size: 3.73vw;

    @media screen {
      @media (min-width: 768px) {
        font-size: 1.82vw;
      }

      @media (min-width: 1200px) {
        font-size: 0.97vw;
      }
    }
  `,
};

const sharedActionTextStyle = css`
  align-items: center;
  cursor: pointer;
  display: flex;
  font-size: 4vw;
  font-weight: 700;
  gap: 2.13vw;
  user-select: none;

  @media screen {
    @media (min-width: 768px) {
      font-size: 1.953125vw;
      gap: 1.0416vw;
    }

    @media (min-width: 1200px) {
      font-size: 1.11vw;
      gap: 0.55vw;
    }
  }
`;

export const Text = {
  Action: {
    Delete: styled.p`
      ${sharedActionTextStyle}
      color: ${({ theme }) => theme.colors.text.action.delete.default};

      &:hover {
        color: ${({ theme }) => theme.colors.text.action.delete.hover};
      }
    `,
    Edit: styled.p`
      ${sharedActionTextStyle}
      color: ${({ theme }) => theme.colors.text.action.edit.default};

      &:hover {
        color: ${({ theme }) => theme.colors.text.action.edit.hover};
      }
    `,
    Reply: styled.p`
      ${sharedActionTextStyle}
      color: ${({ theme }) => theme.colors.text.action.reply.default};

      &:hover {
        color: ${({ theme }) => theme.colors.text.action.reply.hover};
      }
    `,
  },
  Comment: {
    DateTimeDifference: styled.p`
      color: ${({ theme }) => theme.colors.text.comment.dateTime};
      font-size: 3.73vw;

      @media screen {
        @media (min-width: 768px) {
          font-size: 1.82vw;
        }

        @media (min-width: 1200px) {
          font-size: 0.97vw;
        }
      }
    `,
    ReplyToUser: styled.span`
      color: ${({ theme }) => theme.colors.text.comment.replyToUser};
      font-weight: 600;
    `,
    Score: styled.p`
      color: ${({ theme }) => theme.colors.text.comment.score};
      font-size: 4.26vw;
      font-weight: 700;

      @media screen {
        @media (min-width: 768px) {
          font-size: 2.083vw;
        }

        @media (min-width: 1200px) {
          font-size: 1.11vw;
        }
      }
    `,
    Text: styled.p`
      color: ${({ theme }) => theme.colors.text.comment.text};
      font-size: 4.26vw;

      @media screen {
        @media (min-width: 768px) {
          font-size: 2.083vw;
        }

        @media (min-width: 1200px) {
          font-size: 1.11vw;
        }
      }
    `,
    Username: styled.p`
      color: ${({ theme }) => theme.colors.text.comment.username};
      font-size: 4vw;
      font-weight: 700;

      @media screen {
        @media (min-width: 768px) {
          font-size: 1.953125vw;
        }

        @media (min-width: 1200px) {
          font-size: 1.0416vw;
        }
      }
    `,
  },
};
