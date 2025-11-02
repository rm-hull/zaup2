import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

interface ResetDataDialogProps {
  onResetData: () => void;
}

export function ResetDataDialog({ children, onResetData }: PropsWithChildren<ResetDataDialogProps>) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Backdrop />
      <Portal>
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Confirm remove all data?</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              This will remove all OTPs and any custom settings. Please ensure you have a back-up as it will not be
              possible to recover the data once the operation completes.
            </Dialog.Body>

            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="ghost">Cancel</Button>
              </Dialog.ActionTrigger>
              <Button type="submit" onClick={onResetData} colorPalette="red">
                Reset Data
              </Button>
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
