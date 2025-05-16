import { IconButton, useClipboard } from "@chakra-ui/react";
import { useMemo, type JSX } from "react";
import { FiCheck, FiClipboard } from "react-icons/fi";
import { getEncodedSecret } from "../../otp";
import { type OTP } from "../../types";
import { Tooltip } from "@/components/ui/tooltip";

interface CopyEncodedSecretButtonProps {
  otp: OTP;
}

export default function CopyEncodedSecretButton({ otp }: CopyEncodedSecretButtonProps): JSX.Element {
  const encodedSecret = useMemo(() => getEncodedSecret(otp), [otp]);
  const { copied, copy } = useClipboard({ value: encodedSecret ?? "" });
  return (
    <Tooltip showArrow content="Copy secret to Clipboard">
      <IconButton aria-label="copy secret to clipboard" size="sm" onClick={copy} variant="subtle">
        {copied ? <FiCheck color="green" /> : <FiClipboard />}
      </IconButton>
    </Tooltip>
  );
}
