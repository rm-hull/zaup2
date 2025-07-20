import { ProgressBar, ProgressRoot } from "@/components/ui/progress";
import { Suspense, type PropsWithChildren } from "react";

export function Loader({ children }: PropsWithChildren) {
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
