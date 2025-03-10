"use client";
import { Box, Button, Heading, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/LoadingSpinner";
import NavBar from "@/components/NavBar";

export default function Dashboard() {
  const isLoading = useAuth();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [router]);

  if (isLoading) {
    return (
      <LoadingSpinner />
    );
  }

  return (
      <>
        <NavBar></NavBar>
        <Box p="6">
          <Heading>Bem-vindo ao Dashboard</Heading>
          {user && <Box mt="4">Usuário: {user.username} | Perfil: {user.profile}</Box>}
          <Button mt="4" colorScheme="red" onClick={() => {
            localStorage.clear();
            router.push("/login");
          }}>
            Logout
          </Button>
        </Box>
      </>
  );
}
