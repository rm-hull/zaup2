import { IconButton } from "@chakra-ui/react";
import { useCallback } from "react";
import { FiImage } from "react-icons/fi";
import { Tooltip } from "../../components/ui/tooltip";
import { type OTP } from "../../types";
import { FaviconDialog } from "./FaviconDialog";

interface FaviconButtonProps {
  otp: OTP;
  onUpdateRequested: (otp: OTP) => void;
}

export default function FaviconButton({ otp, onUpdateRequested }: FaviconButtonProps) {
  const handleConfirmFavicon = useCallback(
    (favicon?: string) => {
      onUpdateRequested({ ...otp, favicon });
    },
    [otp, onUpdateRequested]
  );

  const label = otp.favicon === undefined ? "Add favicon" : "Update favicon";
  return (
    <FaviconDialog onUpdate={handleConfirmFavicon} url={otp.favicon}>
      <Tooltip showArrow content={label}>
        <IconButton aria-label={label} size="sm" variant="subtle">
          <FiImage />
        </IconButton>
      </Tooltip>
    </FaviconDialog>
  );
}
