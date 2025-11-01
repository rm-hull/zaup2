import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import ReactGA from "react-ga4";
import { BrowserRouter as Router } from "react-router-dom";
import { App } from "./App";
import ErrorFallback from "./components/ErrorFallback";
import PasswordProtection from "./components/PasswordProtection";
import { Provider } from "./components/ui/provider";
import { reportWebVitals } from "./reportWebVitals";

ReactGA.initialize(import.meta.env.VITE_GOOGLE_ANALYTICS_MEASUREMENT_ID as string);

const container = document.getElementById("root");
if (container === null) {
  throw new Error("The #root element wasn't found");
}

const root = createRoot(container);

root.render(
  <StrictMode>
    <Provider>
      <Router basename="/zaup2">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <PasswordProtection>
            <App />
          </PasswordProtection>
        </ErrorBoundary>
      </Router>
    </Provider>
  </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.debug);
