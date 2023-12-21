import { Wrap } from "@chakra-ui/react";
import { type JSX } from "react";
import { getSystemTags } from "../otp";
import { type OTP } from "../types";
import HashTag from "./HashTag";

interface SystemTagsProps {
  otp: OTP;
}

export default function SystemTags({ otp }: SystemTagsProps): JSX.Element {
  return (
    <>
      {getSystemTags(otp).map((tag) => (
        <Wrap key={tag}>
          <HashTag label={tag} system />
        </Wrap>
      ))}
    </>
  );
}
