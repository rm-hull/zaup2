import { IconButton, useDisclosure } from "@chakra-ui/react";
import { type JSX } from "react";
import { FiTrash2 } from "react-icons/fi";
import { type OTP } from "../../types";
import { DeleteDialog } from "./DeleteDialog";
import { Tooltip } from "@/components/ui/tooltip";

interface DeleteButtonProps {
  otp: OTP;
  onDeleteRequested: (otp: OTP) => void;
}

export default function DeleteButton({ otp, onDeleteRequested }: DeleteButtonProps): JSX.Element {
  const { open, onOpen, onClose } = useDisclosure();

  const handleConfirmDelete = (): void => {
    onDeleteRequested(otp);
    setTimeout(onClose, 0);
  };

  return (
    <>
      {open && <DeleteDialog open={open} onDelete={handleConfirmDelete} onCancel={onClose} />}

      <Tooltip showArrow content="Delete OTP">
        <IconButton aria-label="Delete" size="sm" onClick={onOpen}>
          <FiTrash2 />
        </IconButton>
      </Tooltip>
    </>
  );
}
