import { IconButton } from "@chakra-ui/react";
import { useCallback } from "react";
import { FiEdit } from "react-icons/fi";
import { Tooltip } from "../../components/ui/tooltip";
import { type OTP } from "../../types";
import { CustomLabelDialog } from "./CustomLabelDialog";

interface CustomLabelButtonProps {
  otp: OTP;
  onUpdateRequested: (otp: OTP) => void;
}

export default function CustomLabelButton({ otp, onUpdateRequested }: CustomLabelButtonProps) {
  const handleConfirmCustomLabel = useCallback(
    (label?: string) => {
      onUpdateRequested({ ...otp, label });
    },
    [otp, onUpdateRequested]
  );

  const label = otp.label ? "Update custom label" : "Add custom label";
  return (
    <CustomLabelDialog onUpdate={handleConfirmCustomLabel} label={otp.label}>
      <IconButton aria-label={label} size="sm" variant="subtle">
        <Tooltip showArrow content={label}>
          <FiEdit />
        </Tooltip>
      </IconButton>
    </CustomLabelDialog>
  );
}
