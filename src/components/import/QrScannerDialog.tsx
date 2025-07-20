import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react";
import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";
import { PropsWithChildren } from "react";

interface QrScannerDialogProps {
  onScanResult: (uri: string) => void;
  onError: (err: Error) => void;
}

export function QrScannerDialog({ children, onScanResult, onError }: PropsWithChildren<QrScannerDialogProps>) {
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

  const handleError = (err: unknown): void => {
    onError(err as Error);
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>{children}</Dialog.Trigger>
      <Dialog.Backdrop />
      <Portal>
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Scan QR Code</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body height={550}>
              <Scanner formats={["qr_code"]} onScan={handleResult} onError={handleError} />
            </Dialog.Body>

            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="ghost">Cancel</Button>
              </Dialog.ActionTrigger>
            </Dialog.Footer>

            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
