import { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import { AuthContextProvider } from "../modules/auth";
import queryClient from "../utils/queryClient";

import "../styles/globals.css";

if (process.env.NEXT_PUBLIC_ENABLE_API_MOCKS === "true") {
  require("../utils/mocks/setup");
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <ChakraProvider>
        <AuthContextProvider>
          <Component {...pageProps} />
        </AuthContextProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
