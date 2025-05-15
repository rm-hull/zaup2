import { Button, DialogBackdrop, DialogContent, DialogFooter, DialogHeader, DialogRoot } from "@chakra-ui/react";
import { type JSX } from "react";

interface DeleteDialogProps {
  open: boolean;
  onDelete: () => void;
  onCancel: () => void;
}

export function DeleteDialog({ open, onDelete, onCancel }: DeleteDialogProps): JSX.Element {
  return (
    <DialogRoot open={open} onOpenChange={onCancel}>
      <DialogBackdrop />
      <DialogContent>
        <DialogHeader>Confirm delete?</DialogHeader>

        <DialogFooter>
          <Button type="submit" onClick={onDelete} colorPalette="red" mr={3}>
            Delete
          </Button>
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}
