import { Button, Modal, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import React from "react";

type DeleteModalProps = {
  isOpen: boolean;
  onDelete: () => void;
  onCancel: () => void;
};

export function DeleteModal({ isOpen, onDelete, onCancel }: DeleteModalProps): JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirm delete?</ModalHeader>

        <ModalFooter>
          <Button
            type="submit"
            onClick={onDelete}
            bg="red.400"
            color="white"
            _hover={{ bg: "red.500" }}
            _focus={{ bg: "red.500" }}
            mr={3}
          >
            Delete
          </Button>
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}