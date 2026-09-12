import { ErrorFallback } from "@rm-hull/chakra-error-fallback";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { App } from "./App";
import PasswordProtection from "./components/PasswordProtection";
import { Provider } from "./components/ui/provider";
import { Toaster } from "./components/ui/toaster";
import { reportWebVitals } from "./reportWebVitals";
import * as Sentry from "@sentry/react";

if (import.meta.env.VITE_SENTRY_DSN !== undefined) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN as string,
    release: import.meta.env.VITE_GIT_COMMIT_HASH as string,
    environment: import.meta.env.MODE,
  });
}

const container = document.getElementById("root");
if (container === null) {
  throw new Error("The #root element wasn't found");
}

const root = createRoot(container);

root.render(
  <StrictMode>
    <Provider>
      <Router basename="/zaup2">
        <Sentry.ErrorBoundary fallback={ErrorFallback}>
          <PasswordProtection>
            <Toaster />
            <App />
          </PasswordProtection>
        </Sentry.ErrorBoundary>
      </Router>
    </Provider>
  </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.debug);
