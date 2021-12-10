import { IconButton, Tooltip, useDisclosure } from "@chakra-ui/react";
import * as R from "ramda";
import React, { useCallback } from "react";
import { FiPlus } from "react-icons/fi";
import useOtpParameters from "../hooks/useOtpParameters";
import { OTP } from "../types";
import { AddTagModal } from "./AddTagModal";

type AddTagButtonProps = {
  otp: OTP;
};

export default function AddTagButton({ otp }: AddTagButtonProps): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [, update] = useOtpParameters();

  const handleConfirmAddTag = useCallback(
    (tag: string) => {
      update({
        ...otp,
        tags: R.sortBy(R.toLower, R.uniq([...(otp.tags ?? []), tag])),
      });
      onClose();
    },
    [otp, onClose, update]
  );

  return (
    <React.Fragment>
      <AddTagModal isOpen={isOpen} onAdd={handleConfirmAddTag} onCancel={onClose} />

      <Tooltip label="Add tag">
        <IconButton
          aria-label="Add tag"
          disabled={(otp.tags ?? []).length >= 3}
          size="sm"
          onClick={onOpen}
          icon={<FiPlus />}
        />
      </Tooltip>
    </React.Fragment>
  );
}
