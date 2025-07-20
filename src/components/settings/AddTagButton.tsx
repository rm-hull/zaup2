import { IconButton } from "@chakra-ui/react";
import * as R from "ramda";
import { useCallback } from "react";
import { FiPlus } from "react-icons/fi";
import { type OTP } from "../../types";
import { AddTagDialog } from "./AddTagDialog";
import { Tooltip } from "@/components/ui/tooltip";

interface AddTagButtonProps {
  otp: OTP;
  onAddRequested: (otp: OTP) => void;
}

export default function AddTagButton({ otp, onAddRequested }: AddTagButtonProps) {
  const handleConfirmAddTag = useCallback(
    (tag: string) => {
      onAddRequested({
        ...otp,
        tags: R.sortBy(R.toLower, R.uniq([...(otp.tags ?? []), tag])),
      });
    },
    [otp, onAddRequested]
  );

  return (
    <AddTagDialog onAdd={handleConfirmAddTag}>
      <Tooltip showArrow content="Add tag">
        <IconButton aria-label="Add tag" disabled={(otp.tags ?? []).length >= 3} size="sm" variant="subtle">
          <FiPlus />
        </IconButton>
      </Tooltip>
    </AddTagDialog>
  );
}
