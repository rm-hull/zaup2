import { IconButton } from "@chakra-ui/react";
import { FiTrash2 } from "react-icons/fi";
import { Tooltip } from "../../components/ui/tooltip";
import { type OTP } from "../../types";
import { DeleteDialog } from "./DeleteDialog";

interface DeleteButtonProps {
  otp: OTP;
  onDeleteRequested: (otp: OTP) => void;
}

export default function DeleteButton({ otp, onDeleteRequested }: DeleteButtonProps) {
  return (
    <DeleteDialog onDelete={() => onDeleteRequested(otp)}>
      <Tooltip showArrow content="Delete OTP">
        <IconButton aria-label="Delete" size="sm" variant="subtle">
          <FiTrash2 />
        </IconButton>
      </Tooltip>
    </DeleteDialog>
  );
}
