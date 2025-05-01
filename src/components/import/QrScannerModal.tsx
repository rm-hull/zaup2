import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";
import { type JSX } from "react";

interface QrScannerModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onScanResult: (uri: string) => void;
  onError: (err: Error) => void;
}

export function QrScannerModal({ onScanResult, onError, onCancel, isOpen }: QrScannerModalProps): JSX.Element {
  const handleResult = (detectedCodes: IDetectedBarcode[]): void => {
    for (const result of detectedCodes) {
      if (
        result.rawValue?.startsWith("otpauth-migration://offline?data=") ||
        result.rawValue?.startsWith("otpauth://totp/")
      ) {
        setTimeout(() => {
          onScanResult(result.rawValue);
        }, 0);
      }
    }
  };

  const handleClose = (): void => {
    setTimeout(onCancel, 0);
  };

  const handleError = (err: unknown): void => {
    onError(err as Error);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent height={550}>
        <ModalHeader>Scan QR Code</ModalHeader>
        <ModalBody>
          <Scanner formats={["qr_code"]} onScan={handleResult} onError={handleError} />
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
