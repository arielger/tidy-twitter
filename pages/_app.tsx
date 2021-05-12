import Head from "next/head";
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
          <Head>
            <title>Tidy Twitter</title>
            <link
              rel="apple-touch-icon"
              sizes="180x180"
              href="/apple-touch-icon.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="32x32"
              href="/favicon-32x32.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="16x16"
              href="/favicon-16x16.png"
            />
            <link rel="manifest" href="/site.webmanifest" />
          </Head>
          <Component {...pageProps} />
        </AuthContextProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
