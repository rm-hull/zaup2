import { Alert, Box, Code, Text } from "@chakra-ui/react";
import { type JSX } from "react";

export default function SyncInfoPanel(): JSX.Element | null {
  return (
    <Box>
      <Alert.Root status="info" alignItems="flex-start">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>Sync with Google Drive</Alert.Title>
          <Alert.Description>
            <Text>
              In order to sync the OTP data with your Google Drive, you will be prompted to sign in and consent to this
              application reading and writing a file to your Google account. Be aware that the file will be created as{" "}
              <Code>zaup2_sync.json</Code>. If you manually delete this file, then you may loose the ability to sync.
            </Text>
          </Alert.Description>
        </Alert.Content>
      </Alert.Root>
    </Box>
  );
}
