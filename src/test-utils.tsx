import { ChakraProvider, theme } from "@chakra-ui/react";
import { render, type RenderResult, type RenderOptions } from "@testing-library/react";
import { type JSX, type ReactNode, type ReactElement } from "react";

const AllProviders = ({ children }: { children?: ReactNode }): JSX.Element => (
  <ChakraProvider theme={theme}>{children}</ChakraProvider>
);

const customRender = (ui: ReactElement, options?: RenderOptions): RenderResult =>
  render(ui, { wrapper: AllProviders, ...options });

export { customRender as render };
