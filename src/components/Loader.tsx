import { Progress } from "@chakra-ui/react";
import { type JSX, Suspense, type PropsWithChildren } from "react";

export function Loader({ children }: PropsWithChildren): JSX.Element {
  return <Suspense fallback={<Progress size="xs" isIndeterminate />}>{children}</Suspense>;
}
