"use client";
// import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import theme from "@/styles/theme";

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {/* <CacheProvider> */}
          <QueryClientProvider client={queryClient}>
            <ChakraProvider theme={theme}>
              {children}
            </ChakraProvider>
          </QueryClientProvider>
        {/* </CacheProvider> */}
      </body>
    </html>
  );
}
