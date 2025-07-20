import { HStack } from "@chakra-ui/react";

import { getSystemTags } from "../otp";
import { type OTP } from "../types";

import HashTag from "./HashTag";

interface SystemTagsProps {
  otp: OTP;
}

export default function SystemTags({ otp }: SystemTagsProps) {
  return (
    <>
      {getSystemTags(otp).map((tag) => (
        <HStack key={tag} wrap="wrap">
          <HashTag label={tag} system />
        </HStack>
      ))}
    </>
  );
}
