import {
  Button,
  DialogBackdrop,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from "@chakra-ui/react";
import { QrScanner } from "@yudiel/react-qr-scanner";
import { useState, type JSX } from "react";

interface QrScannerModalProps {
  open: boolean;
  onCancel: () => void;
  onScanResult: (uri: string) => void;
  onError: (err: Error) => void;
}

export function QrScannerModal({ onScanResult, onError, onCancel, open }: QrScannerModalProps): JSX.Element {
  const [stopDecoding, setStopDecoding] = useState(false);

  const handleResult = (result: string): void => {
    if (result.startsWith("otpauth-migration://offline?data=")) {
      setStopDecoding(true);
      setTimeout(() => {
        onScanResult(result);
      }, 0);
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
    <DialogRoot open={open} onOpenChange={handleClose}>
      <DialogBackdrop />
      <DialogContent>
        <DialogHeader>Scan QR Code</DialogHeader>

        <DialogBody>
          <QrScanner hideCount stopDecoding={stopDecoding} onDecode={handleResult} onError={handleError} />
        </DialogBody>
        <DialogFooter>
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}
