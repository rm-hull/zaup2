import { Alert, AlertDescription, AlertIcon, AlertTitle } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import Group from "../components/Group";

export default function Issuer(): JSX.Element {
  const { issuer } = useParams();
  return (
    <Group
      filter={(otp) => (otp.label || otp.issuer || "«Unknown»").toLowerCase() === issuer?.toLowerCase()}
      noData={
        <Alert status="warning">
          <AlertIcon />
          <AlertTitle>Unknown Issuer</AlertTitle>
          <AlertDescription>
            There are no 2FA configurations for <em>{issuer}</em>.
          </AlertDescription>
        </Alert>
      }
    />
  );
}
