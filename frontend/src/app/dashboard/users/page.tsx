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
import { fetchUsers, createUser, updateUser, updateUserStatus, User, NewUser } from "@/services/userService";
import axios from "axios";
import { AuthContext } from "@/contexts/AuthContext";

export default function Usuarios() {
  const [isOpen, setIsOpen] = useState(false);
  const [apiErrors, setApiErrors] = useState<string[]>([]);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const toast = useToast();
  const queryClient = useQueryClient();
  const auth = useContext(AuthContext);

  // Fetch users
  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  // Mutation for creating/updating users
  const mutation = useMutation({
    mutationFn: (data: NewUser) => userToEdit ? updateUser(userToEdit.id.toString(), data) : createUser(data),
    onSuccess: () => {
      toast({ title: userToEdit ? "Usuário atualizado!" : "Usuário criado!", status: "success", duration: 3000 });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setApiErrors([]);
      setIsOpen(false);
      setUserToEdit(null);
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error) && error.response?.data) {
        const { message, errors } = error.response.data;
        setApiErrors(errors?.map((err: { message: string }) => err.message) || []);
        if (message) {
          toast({ title: message, status: "error", duration: 3000 });
        }
      } else {
        toast({ title: "Erro desconhecido ao processar usuário", status: "error", duration: 3000 });
      }
    },
  });

  // Toggle user status (Ativar/Inativar)
  const toggleUserStatus = async (id: string, situacao: "ativo" | "inativo") => {
    try {
      await updateUserStatus(id, situacao === "ativo" ? "inativo" : "ativo");
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
        <Button colorScheme="blue" onClick={() => { setUserToEdit(null); setIsOpen(true); }}>Criar Novo Usuário</Button>
      </Box>

      <Table mt={5}>
        <Thead>
          <Tr>
            <Th>Nome</Th>
            <Th>Usuário</Th>
            <Th>Perfil</Th>
            <Th>Ações</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users?.map((user) => (
            <Tr key={user.id}>
              <Td>{user.nome}</Td>
              <Td>{user.usuario}</Td>
              <Td>{user.perfil}</Td>
              <Td>
                <Button size="sm" onClick={() => toggleUserStatus(user.id.toString(), user.situacao)}>
                  {user.situacao === "ativo" ? "Inativar" : "Ativar"}
                </Button>
                <Button size="sm" ml={2} colorScheme="yellow" onClick={() => { setUserToEdit(user); setIsOpen(true); }}>
                  Editar
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* User Modal */}
      <UserModal
        isOpen={isOpen}
        onClose={() => { setIsOpen(false); setUserToEdit(null); }}
        onSubmit={mutation.mutate}
        apiErrors={apiErrors}
        isLoading={mutation.isPending}
        userRole={auth?.user?.profile || "aluno"}
        userToEdit={userToEdit}
      />
    </Box>
  );
}
