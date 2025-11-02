import { Button } from "@chakra-ui/react";
import { ResetDataDialog } from "./ResetDataDialog";

interface ResetDataButtonProps {
  onResetRequested: () => void;
}

export default function ResetDataButton({ onResetRequested }: ResetDataButtonProps) {
  const handleConfirmReset = (): void => {
    onResetRequested();
  };

  return (
    <ResetDataDialog onResetData={handleConfirmReset}>
      <Button colorPalette="red">Reset Data</Button>
    </ResetDataDialog>
  );
}
