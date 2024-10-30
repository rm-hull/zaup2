import { IconButton, Tooltip, useDisclosure } from "@chakra-ui/react";
import { useCallback, type JSX } from "react";
import { FiImage } from "react-icons/fi";
import { type OTP } from "../../types";
import { FaviconModal } from "./FaviconModal";

interface FaviconButtonProps {
  otp: OTP;
  onUpdateRequested: (otp: OTP) => void;
}

export default function FaviconButton({ otp, onUpdateRequested }: FaviconButtonProps): JSX.Element {
  const { open, onOpen, onClose } = useDisclosure();

  const handleConfirmFavicon = useCallback(
    (favicon?: string) => {
      onUpdateRequested({ ...otp, favicon });
      onClose();
    },
    [otp, onClose, onUpdateRequested]
  );

  const label = otp.favicon === undefined ? "Add favicon" : "Update favicon";
  return (
    <>
      {open && <FaviconModal open={open} onUpdate={handleConfirmFavicon} onCancel={onClose} url={otp.favicon} />}

      <Tooltip label={label}>
        <IconButton aria-label={label} size="sm" onClick={onOpen}>
          <FiImage />
        </IconButton>
      </Tooltip>
    </>
  );
}
