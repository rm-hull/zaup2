import { ChakraProvider, ColorModeScript, createLocalStorageManager, theme } from "@chakra-ui/react";
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { App } from "./App";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorker from "./serviceWorker";

const container = document.getElementById("root");
if (!container) {
  throw new Error("The #root element wasn't found");
}

const root = createRoot(container);
const manager = createLocalStorageManager("zaup2.color-mode");

root.render(
  <React.StrictMode>
    <ColorModeScript storageKey="zaup2.color-mode" />
    <ChakraProvider theme={theme} colorModeManager={manager}>
      <Router basename="/zaup2">
        <App />
      </Router>
    </ChakraProvider>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
