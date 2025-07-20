import { lazily } from "react-lazily";
import { Route, Routes, useNavigate } from "react-router-dom";

import { Loader } from "./components/Loader";
import Sidebar from "./components/Sidebar";
import { toaster } from "./components/ui/toaster";
import useOtpParameters from "./hooks/useOtpParameters";
import { normalize } from "./otp";
import { type MigrationPayload } from "./proto/migration_payload";

const { Home } = lazily(async () => await import("./pages/Home"));
const { About } = lazily(async () => await import("./pages/About"));
const { ImportURL } = lazily(async () => await import("./pages/ImportURL"));
const { Settings } = lazily(async () => await import("./pages/Settings"));
const { Issuer } = lazily(async () => await import("./pages/Issuer"));
const { Tag } = lazily(async () => await import("./pages/Tag"));
const { NotFound } = lazily(async () => await import("./pages/NotFound"));

export const App = () => {
  const navigate = useNavigate();
  const { update } = useOtpParameters();

  const storeOTPParameters = (imported: MigrationPayload.OtpParameters[]): void => {
    update(...imported.map((param) => ({ ...normalize(param.toObject()), archived: false })));

    toaster.dismiss();
    toaster.create({
      title: "OTP Codes Imported.",
      description: `We've added the codes into local storage for you.`,
      type: "success",
      duration: 9000,
      closable: true,
    });
    void navigate("/");
  };

  return (
    <Sidebar>
      <Routes>
        <Route
          path="/about"
          element={
            <Loader>
              <About />
            </Loader>
          }
        />
        <Route
          path="/settings"
          element={
            <Loader>
              <Settings />
            </Loader>
          }
        />
        <Route
          path="/import"
          element={
            <Loader>
              <ImportURL onSubmit={storeOTPParameters} />
            </Loader>
          }
        />
        <Route
          path="/tags/:tag"
          element={
            <Loader>
              <Tag />
            </Loader>
          }
        />
        <Route
          path="/issuers/:issuer"
          element={
            <Loader>
              <Issuer />
            </Loader>
          }
        />
        <Route
          path="/"
          element={
            <Loader>
              <Home />
            </Loader>
          }
        />
        <Route
          path="*"
          element={
            <Loader>
              <NotFound />
            </Loader>
          }
        />
      </Routes>
    </Sidebar>
  );
};
