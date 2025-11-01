import { Alert, Em } from "@chakra-ui/react";
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
          <Alert.Content>
            <Alert.Title>Unknown Issuer</Alert.Title>
            <Alert.Description>
              There are no 2FA configurations for <Em>&quot;{issuer}&quot;</Em>.
            </Alert.Description>
          </Alert.Content>
        </Alert.Root>
      }
    />
  );
}
