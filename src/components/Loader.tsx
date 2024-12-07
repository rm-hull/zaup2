import { ProgressBar, ProgressRoot } from "@/components/ui/progress";
import { type JSX, Suspense, type PropsWithChildren } from "react";

export function Loader({ children }: PropsWithChildren): JSX.Element {
  return (
    <Suspense
      fallback={
        <ProgressRoot size="xs" value={null}>
          <ProgressBar />
        </ProgressRoot>
      }
    >
      {children}
    </Suspense>
  );
}
