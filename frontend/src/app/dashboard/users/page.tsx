"use client";
import { Heading, Button, Box } from "@chakra-ui/react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Usuarios() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redireciona para a página de login se o usuário não estiver autenticado
    if (auth && !auth.isAuthenticated) {
      router.push("/login");
    }
  }, [auth, auth?.isAuthenticated, router]);

  // Exibe o spinner de carregamento enquanto a autenticação está sendo verificada
  if (!auth || !auth.isAuthenticated) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Heading>Usuários</Heading>
    </>
  );
}
