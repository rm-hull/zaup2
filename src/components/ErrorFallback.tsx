import { Alert, Code, Container, Heading } from "@chakra-ui/react";

interface ErrorFallbackProps {
  error: Error;
}

export default function ErrorFallback({ error }: ErrorFallbackProps) {
  return (
    <Container maxWidth="container.lg">
      <Alert.Root status="error">
        <Alert.Indicator />
        <Alert.Title>Something went wrong:</Alert.Title>
        <Alert.Description>{error.message}</Alert.Description>
      </Alert.Root>

      <Container m={5}>
        <Heading size="sm">Stack trace</Heading>
        <Code background="none">
          <pre>{error.stack}</pre>
        </Code>
      </Container>
    </Container>
  );
}
