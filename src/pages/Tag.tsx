import { Alert } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import Group from "../components/Group";
import { getSystemTags } from "../otp";

export function Tag() {
  const { tag } = useParams();
  return (
    <Group
      filter={(otp) =>
        getSystemTags(otp)
          .concat(otp.tags ?? [])
          .includes(tag ?? "unknown")
      }
      noData={
        <Alert.Root status="warning">
          <Alert.Indicator />
          <Alert.Title>Unknown Tag</Alert.Title>
          <Alert.Description>
            There are no 2FA configurations for <em>{tag}</em>.
          </Alert.Description>
        </Alert.Root>
      }
    />
  );
}
