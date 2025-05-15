import { Button, useDisclosure } from "@chakra-ui/react";
import { type JSX } from "react";
import { QrScannerModal } from "./QrScannerModal";
import { toaster } from "@/components/ui/toaster";

interface DeleteButtonProps {
  onScanResult: (uri: string) => void;
}

export default function QrScannerButton({ onScanResult }: DeleteButtonProps): JSX.Element {
  const { open, onOpen, onClose } = useDisclosure();

  const handleConfirmDelete = (uri: string): void => {
    onScanResult(uri);
    setTimeout(onClose, 0);
  };

  const handleError = (error: Error): void => {
    onClose();
    toaster.dismiss();
    toaster.create({
      title: "Unable to scan QR code.",
      description: `Error occurred: ${error.message}`,
      type: "error",
      duration: 9000,
      // isClosable: true,
    });
  };

  return (
    <>
      {open && (
        <QrScannerModal open={open} onCancel={onClose} onScanResult={handleConfirmDelete} onError={handleError} />
      )}

      <Button colorPalette="blue" flex="1 0 auto" onClick={onOpen}>
        Scan QR Code
      </Button>
    </>
  );
}
