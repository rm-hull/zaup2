import { IconButton, Tooltip, useDisclosure } from "@chakra-ui/react";
import * as R from "ramda";
import { useCallback, type JSX } from "react";
import { FiPlus } from "react-icons/fi";
import { type OTP } from "../../types";
import { AddTagModal } from "./AddTagModal";

interface AddTagButtonProps {
  otp: OTP;
  onAddRequested: (otp: OTP) => void;
}

export default function AddTagButton({ otp, onAddRequested }: AddTagButtonProps): JSX.Element {
  const { open, onOpen, onClose } = useDisclosure();

  const handleConfirmAddTag = useCallback(
    (tag: string) => {
      onAddRequested({
        ...otp,
        tags: R.sortBy(R.toLower, R.uniq([...(otp.tags ?? []), tag])),
      });
      onClose();
    },
    [otp, onClose, onAddRequested]
  );

  return (
    <>
      {open && <AddTagModal open={open} onAdd={handleConfirmAddTag} onCancel={onClose} />}

      <Tooltip label="Add tag">
        <IconButton aria-label="Add tag" disabled={(otp.tags ?? []).length >= 3} size="sm" onClick={onOpen}>
          <FiPlus />
        </IconButton>
      </Tooltip>
    </>
  );
}
