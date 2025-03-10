"use client"; 
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import theme from "@/styles/theme";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

const queryClient = new QueryClient();

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <LoadingSpinner />
    );
}

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        {children}
      </ChakraProvider>
    </QueryClientProvider>
  );
}