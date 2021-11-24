import { ChakraProvider, Text, theme } from "@chakra-ui/react";
import * as React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Group from "./components/Group";
import Sidebar from "./components/Sidebar";

export const App = (): JSX.Element => (
  <ChakraProvider theme={theme}>
    <Router basename="/zaup2">
      <Sidebar>
        <Routes>
          <Route path="/about" element={<Text>About page</Text>} />
          <Route path="/settings" element={<Text>Settings page</Text>} />
          <Route index element={<Group />} />
          <Route path="/:group" element={<Group />} />
        </Routes>
      </Sidebar>
    </Router>
  </ChakraProvider>
);
