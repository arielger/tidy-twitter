import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClientProvider } from "react-query";

import queryClient from "./queryClient";

// React testing library setup
// https://testing-library.com/docs/react-testing-library/setup

function TestsProviders({ children }: { children?: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>{children}</ChakraProvider>
    </QueryClientProvider>
  );
}

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "queries">
) => render(ui, { wrapper: TestsProviders, ...options });

export * from "@testing-library/react";

export { customRender as render };
