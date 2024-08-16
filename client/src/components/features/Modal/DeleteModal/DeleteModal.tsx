import { createRef, MutableRefObject } from "react";

import { Modal } from "components";
import { useOutsideClick } from "hooks";

import { Button, Container, Text } from "./DeleteModal.style";

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
