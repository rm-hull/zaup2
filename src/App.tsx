import { Text, useToast } from "@chakra-ui/react";
import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useLocalStorage } from "react-use";
import Group from "./components/Group";
import ImportURL from "./components/ImportURL";
import Sidebar from "./components/Sidebar";
import { MigrationPayload } from "./proto/migration_payload";
import { OTP } from "./types";

const normalize = (otp: OTP): OTP => {
  const posn = otp.name?.indexOf(":") ?? -1;

  return {
    ...otp,
    issuer: (posn >= 0 ? otp.name?.slice(0, posn) : otp.issuer) ?? "Unknown",
    name: posn >= 0 ? otp.name?.slice(posn + 1) : otp.name,
  };
};
export const App = (): JSX.Element => {
  const toast = useToast();
  const navigate = useNavigate();
  const [otpParameters, setOtpParameters] = useLocalStorage<OTP[]>("otp-parameters");

  const storeOTPParameters = (otp_parameters: MigrationPayload.OtpParameters[]) => {
    const params = otp_parameters.map((param) => normalize(param.toObject()));

    setOtpParameters((prev) =>
      params.reduce((acc: OTP[], curr: OTP) => {
        if (acc?.find((otp) => otp.issuer === curr.issuer && otp.name === curr.name)) {
          return acc;
        } else {
          return [...acc, curr];
        }
      }, prev ?? [])
    );

    toast({
      title: "OTP Codes Imported.",
      description: `We've added ${otp_parameters.length} codes into local storage for you.`,
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
        <Route path="/settings" element={<Text>Settings page</Text>} />
        <Route path="/import" element={<ImportURL onSubmit={storeOTPParameters} />} />

        <Route index element={<Group otpParameters={otpParameters} />} />
      </Routes>
    </Sidebar>
  );
};
