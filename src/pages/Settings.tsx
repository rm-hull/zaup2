import { Stack, useColorModeValue } from "@chakra-ui/react";
import { type JSX } from "react";
import GeneralSettings from "../components/settings/GeneralSettings";
import OTPSettings from "../components/settings/OTPSettings";
import SyncSettings from "../components/settings/SyncSettings";
import DangerZoneSettings from "../components/settings/DangerZoneSettings";

export default function Settings(): JSX.Element | null {
  const stackBg = useColorModeValue("white", "gray.800");
  return (
    <Stack boxShadow="2xl" bg={stackBg} rounded="xl" p={10} spacing={8} mb={8} align="flex-start" minWidth={950}>
      <GeneralSettings />
      <SyncSettings />
      <OTPSettings />
      <DangerZoneSettings />
    </Stack>
  );
}
