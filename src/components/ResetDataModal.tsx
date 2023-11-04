import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";

type ResetDataModalProps = {
  isOpen: boolean;
  onResetData: () => void;
  onCancel: () => void;
};

export function ResetDataModal({ isOpen, onResetData, onCancel }: ResetDataModalProps): JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirm remove all data?</ModalHeader>
        <ModalBody>
          This will remove all OTPs and any custom settings. Please ensure you have a back-up as it will not be possible
          to recover the data once the operation completes.
        </ModalBody>

        <ModalFooter>
          <Button type="submit" onClick={onResetData} colorScheme="red" mr={3}>
            Reset Data
          </Button>
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
