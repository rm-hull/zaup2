import { Alert, Em } from "@chakra-ui/react";
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
          <Alert.Content>
            <Alert.Title>Unknown Tag</Alert.Title>
            <Alert.Description>
              There are no 2FA configurations for <Em>&quot;{tag}&quot;</Em>.
            </Alert.Description>
          </Alert.Content>
        </Alert.Root>
      }
    />
  );
}
