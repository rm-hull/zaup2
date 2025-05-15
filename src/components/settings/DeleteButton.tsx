import { IconButton } from "@chakra-ui/react";
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
  return (
    <DeleteDialog onDelete={() => onDeleteRequested(otp)}>
      <Tooltip showArrow content="Delete OTP">
        <IconButton aria-label="Delete" size="sm">
          <FiTrash2 />
        </IconButton>
      </Tooltip>
    </DeleteDialog>
  );
}
