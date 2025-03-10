"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Heading } from "@chakra-ui/react";
import axios from "axios";
import api from "@/services/api";
import { useAuthGuard } from "@/hooks/useAuth";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    console.log(localStorage.getItem("user"))
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (!token) {
      router.push("/auth");
      return;
    }
  }, [router]);

  return (
    <Box p="6">
      <Heading>Bem-vindo ao Dashboard</Heading>
      {user && <Box mt="4">Usuário: {user.username} | Perfil: {user.profile}</Box>}
      <Button mt="4" colorScheme="red" onClick={() => {
        localStorage.removeItem("token");
        router.push("/auth");
      }}>
        Logout
      </Button>
    </Box>
  );
}
