import { Button, useDisclosure } from "@chakra-ui/react";
import { type JSX } from "react";
import { ResetDataDialog } from "./ResetDataDialog";
import { Tooltip } from "@/components/ui/tooltip";

interface ResetDataButtonProps {
  onResetRequested: () => void;
}

export default function ResetDataButton({ onResetRequested }: ResetDataButtonProps): JSX.Element {
  const { open, onOpen, onClose } = useDisclosure();

  const handleConfirmReset = (): void => {
    onResetRequested();
    setTimeout(onClose, 0);
  };

  return (
    <>
      {open && <ResetDataDialog open={open} onResetData={handleConfirmReset} onCancel={onClose} />}

      <Tooltip showArrow content="Reset back to initial factory settings">
        <Button colorPalette="red" onClick={onOpen}>
          Reset Data
        </Button>
      </Tooltip>
    </>
  );
}
