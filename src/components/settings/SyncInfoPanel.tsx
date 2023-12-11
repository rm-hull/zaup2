import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Code, Text, VStack } from "@chakra-ui/react";
import { type JSX } from "react";

export default function SyncInfoPanel(): JSX.Element | null {
  return (
    <Box>
      <Alert status="info" alignItems="flex-start">
        <AlertIcon />
        <VStack alignItems="flex-start">
          <AlertTitle>Sync with Google Drive</AlertTitle>
          <AlertDescription>
            <Text>
              In order to sync the OTP data with your Google Drive, you will be prompted to sign in and consent to this
              application reading and writing a file to your Google account. Be aware that the file will be created as{" "}
              <Code>zaup2_sync.json</Code>. If you manually delete this file, then you may loose the ability to sync.
            </Text>
          </AlertDescription>
        </VStack>
      </Alert>
    </Box>
  );
}
