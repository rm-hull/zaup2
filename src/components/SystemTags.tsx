import { Wrap } from "@chakra-ui/react";
import { OTP } from "../types";
import HashTag from "./HashTag";
import { getSystemTags } from "../otp";

type SystemTagsProps = {
  otp: OTP;
};

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
