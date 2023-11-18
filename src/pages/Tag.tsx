import { Alert, AlertDescription, AlertIcon, AlertTitle } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import Group from "../components/Group";
import { getSystemTags } from "../otp";

export default function Tag(): JSX.Element {
  const { tag } = useParams();
  return (
    <Group
      filter={(otp) =>
        getSystemTags(otp)
          .concat(otp.tags ?? [])
          .includes(tag ?? "unknown")
      }
      noData={
        <Alert status="warning">
          <AlertIcon />
          <AlertTitle>Unknown Tag</AlertTitle>
          <AlertDescription>
            There are no 2FA configurations for <em>{tag}</em>.
          </AlertDescription>
        </Alert>
      }
    />
  );
}
