import { IconButton, Tooltip, useDisclosure } from "@chakra-ui/react";
import { useCallback, type JSX } from "react";
import { FiEdit } from "react-icons/fi";
import { type OTP } from "../../types";
import { CustomLabelModal } from "./CustomLabelModal";

interface CustomLabelButtonProps {
  otp: OTP;
  onUpdateRequested: (otp: OTP) => void;
}

export default function CustomLabelButton({ otp, onUpdateRequested }: CustomLabelButtonProps): JSX.Element {
  const { open, onOpen, onClose } = useDisclosure();

  const handleConfirmCustomLabel = useCallback(
    (label?: string) => {
      onUpdateRequested({ ...otp, label });
      onClose();
    },
    [otp, onClose, onUpdateRequested]
  );

  const label = otp.label ? "Update custom label" : "Add custom label";
  return (
    <>
      {open && (
        <CustomLabelModal open={open} onUpdate={handleConfirmCustomLabel} onCancel={onClose} label={otp.label} />
      )}

      <Tooltip label={label}>
        <IconButton aria-label={label} size="sm" onClick={onOpen}>
          <FiEdit />
        </IconButton>
      </Tooltip>
    </>
  );
}
