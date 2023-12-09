import { Button, useDisclosure, useToast } from "@chakra-ui/react";
import { QrScannerModal } from "./QrScannerModal";

interface DeleteButtonProps {
  onScanResult: (uri: string) => void;
}

export default function QrScannerButton({ onScanResult }: DeleteButtonProps): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleConfirmDelete = (uri: string): void => {
    onScanResult(uri);
    setTimeout(onClose, 0);
  };

  const handleError = (error: Error): void => {
    onClose();
    toast.closeAll();
    toast({
      title: "Unable to scan QR code.",
      description: `Error occurred: ${error.message}`,
      status: "error",
      duration: 9000,
      isClosable: true,
    });
  };

  return (
    <>
      {isOpen && (
        <QrScannerModal isOpen={isOpen} onCancel={onClose} onScanResult={handleConfirmDelete} onError={handleError} />
      )}

      <Button colorScheme="blue" flex="1 0 auto" onClick={onOpen}>
        Scan QR Code
      </Button>
    </>
  );
}
