import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { QrScanner } from "@yudiel/react-qr-scanner";
import { useState } from "react";

interface QrScannerModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onScanResult: (uri: string) => void;
  onError: (err: Error) => void;
}

export function QrScannerModal({ onScanResult, onError, onCancel, isOpen }: QrScannerModalProps): JSX.Element {
  const [stopDecoding, setStopDecoding] = useState(false);

  const handleResult = (result: string): void => {
    if (result.startsWith("otpauth-migration://offline?data=")) {
      onScanResult(result);
    }
  };

  const handleClose = (): void => {
    setStopDecoding(true);
    setTimeout(onCancel, 0);
  };

  const handleError = (err: Error): void => {
    if (!stopDecoding) {
      onError(err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Scan QR Code</ModalHeader>

        <ModalBody>
          <QrScanner hideCount stopDecoding={stopDecoding} onDecode={handleResult} onError={handleError} />
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
