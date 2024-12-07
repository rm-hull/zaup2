import {
  Button,
  DialogBackdrop,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from "@chakra-ui/react";
import { type JSX } from "react";

interface ResetDataModalProps {
  open: boolean;
  onResetData: () => void;
  onCancel: () => void;
}

export function ResetDataModal({ open, onResetData, onCancel }: ResetDataModalProps): JSX.Element {
  return (
    <DialogRoot open={open} onOpenChange={onCancel}>
      <DialogBackdrop />
      <DialogContent>
        <DialogHeader>Confirm remove all data?</DialogHeader>
        <DialogBody>
          This will remove all OTPs and any custom settings. Please ensure you have a back-up as it will not be possible
          to recover the data once the operation completes.
        </DialogBody>

        <DialogFooter>
          <Button type="submit" onClick={onResetData} colorScheme="red" mr={3}>
            Reset Data
          </Button>
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}
