import { Button, Tooltip, useDisclosure } from "@chakra-ui/react";
import { ResetDataModal } from "./ResetDataModal";

type ResetDataButtonProps = {
  onResetRequested: () => void;
};

export default function ResetDataButton({ onResetRequested }: ResetDataButtonProps): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleConfirmReset = () => {
    onResetRequested();
    setTimeout(onClose, 0);
  };

  return (
    <>
      {isOpen && <ResetDataModal isOpen={isOpen} onResetData={handleConfirmReset} onCancel={onClose} />}

      <Tooltip label="Reset back to initial factory settings">
        <Button colorScheme="red" onClick={onOpen}>
          Reset Data
        </Button>
      </Tooltip>
    </>
  );
}
