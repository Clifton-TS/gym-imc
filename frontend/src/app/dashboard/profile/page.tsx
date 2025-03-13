"use client";
import { useState } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Avatar,
  VStack,
} from "@chakra-ui/react";
import { AuthContext } from "@/contexts/AuthContext";
import { useContext } from "react";
import ChangePasswordModal from "@/components/ChangePasswordModal";

export default function Perfil() {
  const auth = useContext(AuthContext);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const profileNames: { [key: string]: string } = {
    'admin': 'Administrador',
    'professor': 'Professor',
    'aluno': 'Aluno'
  };

  // Usuário logado
  const user = auth?.user;

  if (!user) {
    return (
      <Box p={5}>
        <Heading>Erro</Heading>
        <Text>Usuário não encontrado. Faça login novamente.</Text>
      </Box>
    );
  }

  return (
    <Box p={5} maxW="600px" mx="auto">
      <VStack spacing={4} align="center">
        <Avatar size="xl" name={user.name} />
        <Heading size="lg">Meu Perfil</Heading>
        <Text fontSize="lg">
          <strong>Usuário:</strong> {user.username}
        </Text>
        <Text fontSize="lg">
          <strong>Nome:</strong> {user.name}
        </Text>
        <Text fontSize="lg">
          <strong>Perfil:</strong> {profileNames[user.profile] || 'Desconhecido'}
        </Text>
        <Button colorScheme="blue" onClick={() => setIsPasswordModalOpen(true)}>
          Alterar Senha
        </Button>
      </VStack>

      {/* Modal para alterar senha */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        id={user.id}
        requiresCurrentPassword={true} // Nova prop para exigir senha atual
      />
    </Box>
  );
}
