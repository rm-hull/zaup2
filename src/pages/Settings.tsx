import { Flex, Stack, useColorModeValue } from "@chakra-ui/react";
import GeneralSettings from "../components/settings/GeneralSettings";
import OTPSettings from "../components/settings/OTPSettings";

export default function Settings(): JSX.Element | null {
  const stackBg = useColorModeValue("white", "gray.800");
  return (
    <Flex minH="90vh" justify="center" py={6} direction="column" align="center">
      <Stack boxShadow="2xl" bg={stackBg} rounded="xl" p={10} spacing={8} mb={8} align="center" minWidth={1024}>
        <GeneralSettings />
      </Stack>

      <Stack boxShadow="2xl" bg={stackBg} rounded="xl" p={10} spacing={8} align="center" minWidth={1024}>
        <OTPSettings />
      </Stack>
    </Flex>
  );
}
