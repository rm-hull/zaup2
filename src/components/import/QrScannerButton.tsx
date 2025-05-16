import { Button } from "@chakra-ui/react";
import { type JSX } from "react";
import { QrScannerDialog } from "./QrScannerDialog";
import { toaster } from "@/components/ui/toaster";

interface DeleteButtonProps {
  onScanResult: (uri: string) => void;
}

export default function QrScannerButton({ onScanResult }: DeleteButtonProps): JSX.Element {
  const handleError = (error: Error): void => {
    toaster.dismiss();
    toaster.create({
      title: "Unable to scan QR code.",
      description: `Error occurred: ${error.message}`,
      type: "error",
      duration: 9000,
      closable: true
    });
  };

  return (
    <QrScannerDialog onScanResult={onScanResult} onError={handleError}>
      <Button colorPalette="blue">Scan QR Code</Button>
    </QrScannerDialog>
  );
}
