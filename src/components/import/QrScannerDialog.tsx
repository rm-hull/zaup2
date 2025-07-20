import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react";
import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";
import { PropsWithChildren, useState, type JSX } from "react";

interface QrScannerDialogProps {
  onScanResult: (uri: string) => void;
  onError: (err: Error) => void;
}

export function QrScannerDialog({
  children,
  onScanResult,
  onError,
}: PropsWithChildren<QrScannerDialogProps>): JSX.Element {
  const [open, setOpen] = useState(false);
  const handleResult = (detectedCodes: IDetectedBarcode[]): void => {
    for (const result of detectedCodes) {
      if (
        result.rawValue?.startsWith("otpauth-migration://offline?data=") ||
        result.rawValue?.startsWith("otpauth://totp/")
      ) {
        setTimeout(() => {
          onScanResult(result.rawValue);
          setOpen(false);
        }, 0);
      }
    }
  };

  const handleError = (err: unknown): void => {
    onError(err as Error);
  };

  return (
    <Dialog.Root lazyMount open={open} onOpenChange={(e) => setOpen(e.open)}>
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
