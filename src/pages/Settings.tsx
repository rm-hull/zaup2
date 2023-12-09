import { Stack, useColorModeValue } from "@chakra-ui/react";
import { type JSX } from "react";
import GeneralSettings from "../components/settings/GeneralSettings";
import OTPSettings from "../components/settings/OTPSettings";

export default function Settings(): JSX.Element | null {
  const stackBg = useColorModeValue("white", "gray.800");
  return (
    <Stack boxShadow="2xl" bg={stackBg} rounded="xl" p={10} spacing={8} mb={8} align="center" minWidth={950}>
      <GeneralSettings />

      <OTPSettings />
    </Stack>
  );
}
