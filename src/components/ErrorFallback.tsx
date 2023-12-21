import { Alert, AlertDescription, AlertIcon, AlertTitle, Code, Container, Heading } from "@chakra-ui/react";
import { type JSX } from "react";

interface ErrorFallbackProps {
  error: Error;
}

export default function ErrorFallback({ error }: ErrorFallbackProps): JSX.Element {
  return (
    <Container maxWidth="container.lg">
      <Alert status="error">
        <AlertIcon />
        <AlertTitle>Something went wrong:</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>

      <Container m={5}>
        <Heading size="sm">Stack trace</Heading>
        <Code background="none">
          <pre>{error.stack}</pre>
        </Code>
      </Container>
    </Container>
  );
}
