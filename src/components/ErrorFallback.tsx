import { useReadableStack } from "@/hooks/useReadableStack";
import { Accordion, Alert, Box, Code, Container, Heading, HStack, Span, Strong, VStack } from "@chakra-ui/react";
import { BsArrowReturnRight } from "react-icons/bs";

interface CauseProps {
  error?: Error;
}

function Cause({ error }: CauseProps) {
  if (error === undefined) {
    return null;
  }

  return (
    <VStack alignItems="start" gap={0.5}>
      {error.message}
      {error.cause instanceof Error && (
        <HStack alignItems="start">
          <Box mt={0.5} ml={4}>
            <BsArrowReturnRight />
          </Box>
          <Cause error={error.cause} />
        </HStack>
      )}
    </VStack>
  );
}

interface ErrorFallbackProps {
  title?: string;
  error: Error;
}

export default function ErrorFallback({ error, title = "Something went wrong" }: ErrorFallbackProps) {
  const { stack, loading } = useReadableStack(error);

  return (
    <Container maxWidth="container.lg" mt={8}>
      <Alert.Root status="error">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>
            <Strong>{title}</Strong>
            {loading && <Span color="gray.500"> (resolving source maps…)</Span>}
          </Alert.Title>
          <Alert.Description>
            <Cause error={error} />
          </Alert.Description>
        </Alert.Content>
      </Alert.Root>

      <Container m={5}>
        <Accordion.Root collapsible variant="plain">
          <Accordion.Item value="stack">
            <Accordion.ItemTrigger>
              <Heading size="sm">Stack trace</Heading>
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
            <Accordion.ItemContent>
              <Accordion.ItemBody>
                <Code background="none">
                  <pre>{stack}</pre>
                </Code>
              </Accordion.ItemBody>
            </Accordion.ItemContent>
          </Accordion.Item>
        </Accordion.Root>
      </Container>
    </Container>
  );
}
