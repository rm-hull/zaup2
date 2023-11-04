import { Button, Modal, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";

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
          <Button type="submit" onClick={onDelete} colorScheme="red" mr={3}>
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
