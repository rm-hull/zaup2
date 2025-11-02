import { type PropsWithChildren, Suspense } from "react";
import { ProgressBar, ProgressRoot } from "./ui/progress";

export function Loader({ children }: PropsWithChildren) {
  return (
    <Suspense
      fallback={
        <ProgressRoot size="xs" value={null} colorPalette="blue" variant="subtle">
          <ProgressBar />
        </ProgressRoot>
      }
    >
      {children}
    </Suspense>
  );
}
