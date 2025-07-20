import { Alert } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

import Group from "../components/Group";

export function Issuer() {
  const { issuer } = useParams();
  return (
    <Group
      filter={(otp) => (otp.label ?? otp.issuer ?? "«Unknown»").toLowerCase() === issuer?.toLowerCase()}
      noData={
        <Alert.Root status="warning">
          <Alert.Indicator />
          <Alert.Title>Unknown Issuer</Alert.Title>
          <Alert.Description>
            There are no 2FA configurations for <em>{issuer}</em>.
          </Alert.Description>
        </Alert.Root>
      }
    />
  );
}
