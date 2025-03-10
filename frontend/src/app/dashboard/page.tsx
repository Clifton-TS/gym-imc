"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Heading } from "@chakra-ui/react";
import axios from "axios";
import { useAuthGuard } from "@/hooks/useAuth";

useAuthGuard();

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth");
      return;
    }

    axios.get("http://localhost:3000/users/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => setUser(response.data))
      .catch(() => {
        localStorage.removeItem("token");
        router.push("/auth");
      });
  }, [router]);

  return (
    <Box p="6">
      <Heading>Bem-vindo ao Dashboard</Heading>
      {user && <Box mt="4">Usuário: {user.usuario} | Perfil: {user.perfil}</Box>}
      <Button mt="4" colorScheme="red" onClick={() => {
        localStorage.removeItem("token");
        router.push("/auth");
      }}>
        Logout
      </Button>
    </Box>
  );
}
