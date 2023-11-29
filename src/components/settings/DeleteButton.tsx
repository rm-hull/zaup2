import { IconButton, Tooltip, useDisclosure } from "@chakra-ui/react";
import { FiTrash2 } from "react-icons/fi";
import { type OTP } from "../../types";
import { DeleteModal } from "./DeleteModal";

interface DeleteButtonProps {
  otp: OTP;
  onDeleteRequested: (otp: OTP) => void;
}

export default function DeleteButton({ otp, onDeleteRequested }: DeleteButtonProps): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleConfirmDelete = (): void => {
    onDeleteRequested(otp);
    setTimeout(onClose, 0);
  };

  return (
    <>
      {isOpen && <DeleteModal isOpen={isOpen} onDelete={handleConfirmDelete} onCancel={onClose} />}

      <Tooltip label="Delete OTP">
        <IconButton aria-label="Delete" size="sm" onClick={onOpen} icon={<FiTrash2 />} />
      </Tooltip>
    </>
  );
}
