import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button, Code, Text, VStack } from "@chakra-ui/react";
import { googleLogout } from "@react-oauth/google";
import { type JSX } from "react";
import useAccessToken from "../../hooks/useAccessToken";

export default function GoogleDriveSettings(): JSX.Element | null {
  const [accessToken, setAccessToken] = useAccessToken();
  const handleLogout = (): void => {
    googleLogout();
    setAccessToken(undefined);
  };

  return (
    <Box>
      <Alert status="info" alignItems="flex-start">
        <AlertIcon />
        <VStack alignItems="flex-start">
          <AlertTitle>Sync with Google Drive</AlertTitle>
          <AlertDescription>
            <Text>
              In order to sync the OTP data with your Google Drive, you will need to sign in and consent to this
              application reading and writing a file to your Google account. Be aware that the file will be created as{" "}
              <Code>zaup2_sync.json</Code>. If you manually delete this file or its directory, then you may loose the
              ability to sync.
            </Text>
          </AlertDescription>
          {accessToken !== undefined && (
            <Button variant="link" onClick={handleLogout} color="blue.400">
              Log out of your Google account
            </Button>
          )}
        </VStack>
      </Alert>
    </Box>
  );
}
