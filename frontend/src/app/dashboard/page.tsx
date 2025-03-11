"use client";
import { Heading, Box } from "@chakra-ui/react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Dashboard() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth && !auth.isAuthenticated) {
      router.push("/login");
    }
  }, [auth, auth?.isAuthenticated, router]);

  if (!auth || !auth.isAuthenticated) {
    return <LoadingSpinner />;
  }

  return (
    <Box>
      <Heading>Bem-vindo ao Dashboard</Heading>
      <p>Selecione uma opção no menu acima.</p>
    </Box>
  );
}
