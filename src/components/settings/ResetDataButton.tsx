import { Button } from "@chakra-ui/react";

import { Tooltip } from "../../components/ui/tooltip";

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
      <Tooltip showArrow content="Reset back to initial factory settings">
        <Button colorPalette="red">Reset Data</Button>
      </Tooltip>
    </ResetDataDialog>
  );
}
