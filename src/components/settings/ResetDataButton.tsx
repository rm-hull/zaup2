import { Button } from "@chakra-ui/react";
import { type JSX } from "react";
import { ResetDataDialog } from "./ResetDataDialog";
import { Tooltip } from "@/components/ui/tooltip";

interface ResetDataButtonProps {
  onResetRequested: () => void;
}

export default function ResetDataButton({ onResetRequested }: ResetDataButtonProps): JSX.Element {
  const handleConfirmReset = (): void => {
    onResetRequested();
  };

  return (
    <ResetDataDialog onResetData={handleConfirmReset}>
      <Tooltip showArrow content="Reset back to initial factory settings">
        <Button colorPalette="red">Reset Data</Button>
      </Tooltip>
    </ResetDataDialog>
  );
}
