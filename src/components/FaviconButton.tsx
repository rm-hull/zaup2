import { IconButton, Tooltip, useDisclosure } from "@chakra-ui/react";
import { useCallback } from "react";
import { FiImage } from "react-icons/fi";
import { OTP } from "../types";
import { FaviconModal } from "./FaviconModal";

type FaviconButtonProps = {
  otp: OTP;
  onUpdateRequested: (otp: OTP) => void;
};

export default function FaviconButton({ otp, onUpdateRequested }: FaviconButtonProps): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleConfirmFavicon = useCallback(
    (favicon?: string) => {
      onUpdateRequested({ ...otp, favicon });
      onClose();
    },
    [otp, onClose, onUpdateRequested]
  );

  const label = otp.favicon ? "Update favicon" : "Add favicon";
  return (
    <>
      {isOpen && <FaviconModal isOpen={isOpen} onUpdate={handleConfirmFavicon} onCancel={onClose} url={otp.favicon} />}

      <Tooltip label={label}>
        <IconButton aria-label={label} size="sm" onClick={onOpen} icon={<FiImage />} />
      </Tooltip>
    </>
  );
}
