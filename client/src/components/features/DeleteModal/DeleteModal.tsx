import { createRef, MutableRefObject } from "react";
import styled, { css } from "styled-components";

import { Colors } from "colors";
import { Modal } from "components";
import { useOutsideClick } from "hooks";

const sharedButtonStyle = css`
  border-radius: 2.13vw;
  cursor: pointer;
  flex: 1;
  font-size: 3.46vw;
  font-weight: 600;
  padding: 3.2vw 4.26vw;
  text-transform: uppercase;
  user-select: none;

  @media screen {
    @media (min-width: 768px) {
      border-radius: 1.0416vw;
      font-size: 1.7vw;
      padding: 1.5625vw 2.083vw;
    }

    @media (min-width: 1200px) {
      border-radius: 0.55vw;
      font-size: 0.9vw;
      padding: 0.83vw 1.11vw;
    }
  }
`;

const Button = {
  Cancel: styled.button.attrs({ type: "button" })`
    ${sharedButtonStyle}
    background-color: ${Colors.Neutral.GrayishBlue};
    color: ${Colors.Neutral.White};

    &:hover {
      background-color: ${Colors.Neutral.LightGray};
    }
  `,
  Delete: styled.button.attrs({ type: "button" })`
    ${sharedButtonStyle}
    background-color: ${Colors.Primary.SoftRed};
    color: ${Colors.Neutral.LightGray};

    &:hover {
      background-color: ${Colors.Primary.PaleRed};
    }
  `,
};

const Container = {
  Buttons: styled.div`
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
};

const Text = {
  Message: styled.p`
    color: ${Colors.Neutral.GrayishBlue};
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
  Title: styled.p`
    color: ${Colors.Neutral.DarkBlue};
    font-size: 4.26vw;
    font-weight: 700;

    @media screen {
      @media (min-width: 768px) {
        font-size: 2.083vw;
      }

      @media (min-width: 1200px) {
        font-size: 1.38vw;
      }
    }
  `,
};

interface Props {
  onClose: () => void;
  onDelete: () => void;
}

export function DeleteModal({ onClose, onDelete }: Props) {
  const modalInnerContainerRef = createRef<HTMLDivElement>();

  useOutsideClick({
    ref: modalInnerContainerRef as MutableRefObject<HTMLElement>,
    handle: onClose,
  });

  function handleDeleteClick() {
    onDelete();
    onClose();
  }

  return (
    <Modal ref={modalInnerContainerRef}>
      <Text.Title>Delete comment</Text.Title>
      <Text.Message>
        Are you sure you want to delete this comment? This will remove the
        comment and can't be undone.
      </Text.Message>
      <Container.Buttons>
        <Button.Cancel onClick={onClose}>No, cancel</Button.Cancel>
        <Button.Delete onClick={handleDeleteClick}>Yes, delete</Button.Delete>
      </Container.Buttons>
    </Modal>
  );
}
