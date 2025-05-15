import { IconButton } from "@chakra-ui/react";
import { useCallback, type JSX } from "react";
import { FiEdit } from "react-icons/fi";
import { type OTP } from "../../types";
import { CustomLabelDialog } from "./CustomLabelDialog";
import { Tooltip } from "@/components/ui/tooltip";

interface CustomLabelButtonProps {
  otp: OTP;
  onUpdateRequested: (otp: OTP) => void;
}

export default function CustomLabelButton({ otp, onUpdateRequested }: CustomLabelButtonProps): JSX.Element {
  const handleConfirmCustomLabel = useCallback(
    (label?: string) => {
      onUpdateRequested({ ...otp, label });
    },
    [otp, onUpdateRequested]
  );

  const label = otp.label ? "Update custom label" : "Add custom label";
  return (
    <CustomLabelDialog onUpdate={handleConfirmCustomLabel} label={otp.label}>
      <Tooltip showArrow content={label}>
        <IconButton aria-label={label} size="sm">
          <FiEdit />
        </IconButton>
      </Tooltip>
    </CustomLabelDialog>
  );
}
