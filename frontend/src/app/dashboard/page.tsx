"use client";
import { Box, Button, Heading } from "@chakra-ui/react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import NavBar from "@/components/NavBar";

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

  console.log(JSON.stringify(auth, null, 2))

  return (
    <>
      <NavBar />
      <Box p="6">
        <Heading>Bem-vindo ao Dashboard</Heading>
        {auth.user && (
          <Box mt="4">
            Usuário: {auth.user.username} | Perfil: {auth.user.profile}
          </Box>
        )}
        <Button mt="4" colorScheme="red" onClick={auth.logout}>
          Logout
        </Button>
      </Box>
    </>
  );
}
