import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

interface DeleteDialogProps {
  onDelete: () => void;
}

export function DeleteDialog({ children, onDelete }: PropsWithChildren<DeleteDialogProps>) {
  return (
    <Dialog.Root size="xs">
      <Dialog.Trigger>{children}</Dialog.Trigger>
      <Dialog.Backdrop />
      <Portal>
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Confirm delete?</Dialog.Title>
            </Dialog.Header>

            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="ghost">Cancel</Button>
              </Dialog.ActionTrigger>
              <Button type="submit" onClick={onDelete} colorPalette="red">
                Delete
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
