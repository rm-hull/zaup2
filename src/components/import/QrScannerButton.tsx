import { Button } from "@chakra-ui/react";
import { toaster } from "../../components/ui/toaster";
import { QrScannerDialog } from "./QrScannerDialog";

interface DeleteButtonProps {
  onScanResult: (uri: string) => void;
}

export default function QrScannerButton({ onScanResult }: DeleteButtonProps) {
  const handleError = (error: Error): void => {
    toaster.dismiss();
    toaster.create({
      title: "Unable to scan QR code.",
      description: `Error occurred: ${error.message}`,
      type: "error",
      duration: 9000,
      closable: true,
    });
  };

  return (
    <QrScannerDialog onScanResult={onScanResult} onError={handleError}>
      <Button colorPalette="blue">Scan QR Code</Button>
    </QrScannerDialog>
  );
}
