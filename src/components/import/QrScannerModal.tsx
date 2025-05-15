import {
  Button,
  DialogBackdrop,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from "@chakra-ui/react";
import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";
import { type JSX } from "react";

interface QrScannerModalProps {
  open: boolean;
  onCancel: () => void;
  onScanResult: (uri: string) => void;
  onError: (err: Error) => void;
}

export function QrScannerModal({ open, onScanResult, onError, onCancel }: QrScannerModalProps): JSX.Element {
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
    <DialogRoot open={open} onOpenChange={handleClose}>
      <DialogBackdrop />
      <DialogContent height={550}>
        <DialogHeader>Scan QR Code</DialogHeader>

        <DialogBody>
          <Scanner formats={["qr_code"]} onScan={handleResult} onError={handleError} />
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
