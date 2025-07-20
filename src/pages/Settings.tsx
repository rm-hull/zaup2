import { Stack } from "@chakra-ui/react";
import GeneralSettings from "../components/settings/GeneralSettings";
import OTPSettings from "../components/settings/OTPSettings";
import SyncSettings from "../components/settings/SyncSettings";
import DangerZoneSettings from "../components/settings/DangerZoneSettings";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useColorModeValue } from "@/components/ui/color-mode";

export function Settings() {
  const stackBg = useColorModeValue("white", "gray.800");
  return (
    <Stack boxShadow="2xl" bg={stackBg} rounded="xl" p={10} gap={8} mb={8} align="flex-start" minWidth={950}>
      <GeneralSettings />
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_API_CLIENT_ID as string}>
        <SyncSettings />
      </GoogleOAuthProvider>
      <OTPSettings />
      <DangerZoneSettings />
    </Stack>
  );
}
