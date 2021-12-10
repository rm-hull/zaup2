import { IconButton, Tooltip, useDisclosure } from "@chakra-ui/react";
import React from "react";
import { FiTrash2 } from "react-icons/fi";
import useOtpParameters from "../hooks/useOtpParameters";
import { OTP } from "../types";
import { DeleteModal } from "./DeleteModal";

type DeleteButtonProps = {
  otp: OTP;
};

export default function DeleteButton({ otp }: DeleteButtonProps): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [, , remove] = useOtpParameters();

  const handleConfirmDelete = () => {
    remove(otp);
    onClose();
  };

  return (
    <React.Fragment>
      <DeleteModal isOpen={isOpen} onDelete={handleConfirmDelete} onCancel={onClose} />

      <Tooltip label="Delete OTP">
        <IconButton aria-label="Delete" size="sm" onClick={onOpen} icon={<FiTrash2 />} />
      </Tooltip>
    </React.Fragment>
  );
}
