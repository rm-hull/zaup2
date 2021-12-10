import { IconButton, Tooltip, useDisclosure } from "@chakra-ui/react";
import React, { useCallback } from "react";
import { FiEdit } from "react-icons/fi";
import { OTP } from "../types";
import { CustomLabelModal } from "./CustomLabelModal";

type CustomLabelButtonProps = {
  otp: OTP;
  onUpdateRequested: (otp: OTP) => void;
};

export default function CustomLabelButton({ otp, onUpdateRequested }: CustomLabelButtonProps): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleConfirmCustomLabel = useCallback(
    (label?: string) => {
      onUpdateRequested({ ...otp, label });
      onClose();
    },
    [otp, onClose, onUpdateRequested]
  );

  return (
    <React.Fragment>
      {isOpen && (
        <CustomLabelModal isOpen={isOpen} onUpdate={handleConfirmCustomLabel} onCancel={onClose} label={otp.label} />
      )}

      <Tooltip label="Add custom label">
        <IconButton aria-label="Add custom label" size="sm" onClick={onOpen} icon={<FiEdit />} />
      </Tooltip>
    </React.Fragment>
  );
}
