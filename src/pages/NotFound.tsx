import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { type JSX } from "react";
import { Link } from "react-router-dom";

export function NotFound(): JSX.Element {
  return (
    <Box textAlign="center" py={10} px={6}>
      <Heading
        display="inline-block"
        as="h2"
        size="2xl"
        bgGradient="linear(to-r, cyan.400, cyan.600)"
        backgroundClip="text"
      >
        404
      </Heading>
      <Text fontSize="18px" mt={3} mb={2}>
        Page Not Found
      </Text>
      <Text color={"gray.500"} mb={6}>
        The page you are looking for does not seem to exist
      </Text>

      <Button
        asChild
        colorPalette="cyan"
        bgGradient="linear(to-r, cyan.400, cyan.500, cyan.600)"
        color="white"
        variant="solid"
      >
        <Link to="/">Go to Home</Link>
      </Button>
    </Box>
  );
}
