import { Text, useToast } from "@chakra-ui/react";
import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useLocalStorage } from "react-use";
import Group from "./components/Group";
import ImportURL from "./components/ImportURL";
import Sidebar from "./components/Sidebar";

export const App = (): JSX.Element => {
  const toast = useToast();
  const navigate = useNavigate();
  const [, setValue] = useLocalStorage("otp-parameters");

  return (
    <Sidebar>
      <Routes>
        <Route path="/about" element={<Text>About page</Text>} />
        <Route path="/settings" element={<Text>Settings page</Text>} />
        <Route
          path="/import"
          element={
            <ImportURL
              onSubmit={(otp_parameters) => {
                const params = otp_parameters.map((param) => param.toObject());
                setValue(params);
                toast({
                  title: "OTP Codes Imported.",
                  description: `We've added ${otp_parameters.length} codes into local storage for you.`,
                  status: "success",
                  duration: 9000,
                  isClosable: true,
                });
                navigate("/");
              }}
            />
          }
        />

        <Route index element={<Group />} />
        <Route path="/:group" element={<Group />} />
      </Routes>
    </Sidebar>
  );
};
