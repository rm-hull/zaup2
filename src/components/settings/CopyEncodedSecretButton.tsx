import { IconButton, Tooltip, useClipboard } from "@chakra-ui/react";
import { useMemo, type JSX } from "react";
import { FiCheck, FiClipboard } from "react-icons/fi";
import { getEncodedSecret } from "../../otp";
import { type OTP } from "../../types";

interface CopyEncodedSecretButtonProps {
  otp: OTP;
}

export default function CopyEncodedSecretButton({ otp }: CopyEncodedSecretButtonProps): JSX.Element {
  const encodedSecret = useMemo(() => getEncodedSecret(otp), [otp]);
  const { copied, copy } = useClipboard({ value: encodedSecret ?? "" });
  return (
    <Tooltip label="Copy secret to Clipboard">
      <IconButton aria-label="copy secret to clipboard" size="sm" onClick={copy}>
        {copied ? <FiCheck color="green" /> : <FiClipboard />}
      </IconButton>
    </Tooltip>
  );
}
