import { Heading, Stack, useColorModeValue } from "@chakra-ui/react";
import { type JSX } from "react";
import TestUpload from "../components/test/TestUpload";

export default function GoogleDriveTest(): JSX.Element | null {
  return (
    <Stack
      boxShadow="2xl"
      bg={useColorModeValue("white", "gray.800")}
      rounded="xl"
      p={10}
      spacing={4}
      align="left"
      alignItems="flex-start"
      minWidth={950}
    >
      <Heading size="md">Google Drive - Testing Page</Heading>

      <TestUpload />
    </Stack>
  );
}
