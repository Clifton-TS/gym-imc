"use client";
import { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Heading,
  Button,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
} from "@chakra-ui/react";
import UserModal from "@/components/UserModal";
import { fetchUsers, createUser, updateUserStatus } from "@/services/userService";
import axios from "axios";
import { AuthContext } from "@/contexts/AuthContext";

export default function Usuarios() {
  const [isOpen, setIsOpen] = useState(false);
  const [apiErrors, setApiErrors] = useState<string[]>([]);
  const toast = useToast();
  const queryClient = useQueryClient();
  const auth = useContext(AuthContext);

  // Buscar usuários
  const { data: users, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  // Mutação para criação de usuário
  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast({ title: "Usuário criado!", status: "success", duration: 3000 });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setApiErrors([]);
      setIsOpen(false);
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error) && error.response?.data) {
        const { message, errors } = error.response.data;
        setApiErrors(errors?.map((err: { message: string }) => err.message) || []);
        if (message) {
          toast({ title: message, status: "error", duration: 3000 });
        }
      } else {
        toast({ title: "Erro desconhecido ao criar usuário", status: "error", duration: 3000 });
      }
    },
  });

  // Alternar status do usuário
  const toggleUserStatus = async (usuario: string, situacao: "ativo" | "inativo") => {
    try {
      await updateUserStatus(usuario, situacao === "ativo" ? "inativo" : "ativo");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({ title: "Status do usuário atualizado com sucesso!", status: "success", duration: 3000 });
    } catch (error) {
      toast({ title: "Erro ao atualizar status do usuário", status: "error", duration: 3000 });
    }
  };

  return (
    <Box p={5}>
      
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Heading mb={5}>Usuários</Heading>
        <Button colorScheme="blue" onClick={() => setIsOpen(true)}>Criar Novo Usuário</Button>
      </Box>

      <Table mt={5}>
        <Thead>
            <Tr>
            <Th>Nome</Th>
            <Th>Usuário</Th>
            <Th>Perfil</Th>
            <Th textAlign="center">Ações</Th>
            </Tr>
        </Thead>
        <Tbody>
          {users?.map((user) => (
            <Tr key={user.id}>
              <Td>{user.nome}</Td>
              <Td>{user.usuario}</Td>
              <Td>{user.perfil}</Td>
              <Td textAlign="center">
                <Button size="sm" onClick={() => toggleUserStatus(user.usuario, user.situacao)}>
                  {user.situacao === "ativo" ? "Inativar" : "Ativar"}
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Modal de Usuário */}
      <UserModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={mutation.mutate}
        apiErrors={apiErrors}
        isLoading={mutation.isPending}
        userRole={auth?.user?.profile || "Aluno"} 
      />
    </Box>
  );
}
