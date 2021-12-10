import { Text, useToast } from "@chakra-ui/react";
import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import useOtpParameters from "./hooks/useOtpParameters";
import { normalize } from "./otp";
import Home from "./pages/Home";
import ImportURL from "./pages/ImportURL";
import Issuer from "./pages/Issuer";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import Tag from "./pages/Tag";
import { MigrationPayload } from "./proto/migration_payload";

export const App = (): JSX.Element => {
  const toast = useToast();
  const navigate = useNavigate();
  const { update } = useOtpParameters();

  const storeOTPParameters = (imported: MigrationPayload.OtpParameters[]) => {
    update(...imported.map((param) => normalize(param.toObject())));

    toast({
      title: "OTP Codes Imported.",
      description: `We've added the codes into local storage for you.`,
      status: "success",
      duration: 9000,
      isClosable: true,
    });
    navigate("/");
  };

  return (
    <Sidebar>
      <Routes>
        <Route path="/about" element={<Text>About page</Text>} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/import" element={<ImportURL onSubmit={storeOTPParameters} />} />
        <Route path="/tags/:tag" element={<Tag />} />
        <Route path="/issuers/:issuer" element={<Issuer />} />
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Sidebar>
  );
};
