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
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import UserModal from "@/components/UserModal";
import { fetchUsers, createUser, updateUser, updateUserStatus, deleteUser, User, NewUser } from "@/services/userService";
import axios from "axios";
import { AuthContext } from "@/contexts/AuthContext";
import { CheckIcon, CloseIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";

export default function Usuarios() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [apiErrors, setApiErrors] = useState<string[]>([]);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const toast = useToast();
  const queryClient = useQueryClient();
  const auth = useContext(AuthContext);

  if (auth?.user?.profile === "aluno") {
    return null;
  }

  // Determina os parâmetros de filtro com base no perfil do usuário
  const userFilterParams = auth?.user?.profile === "professor" ? { perfil: "aluno" } : {};

  // Busca usuários com os filtros apropriados
  const { data: users, isLoading } = useQuery({
    queryKey: ["users", userFilterParams],
    queryFn: () => fetchUsers(userFilterParams),
  });

  // Mutação para criar/atualizar usuários
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

  // Alternar status do usuário (Ativar/Inativar)
  const toggleUserStatus = async (id: string, situacao: "ativo" | "inativo") => {
    try {
      await updateUserStatus(id, situacao === "ativo" ? "inativo" : "ativo");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({ title: "Status do usuário atualizado com sucesso!", status: "success", duration: 3000 });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        const { message } = error.response.data;
        if (message) {
          toast({ title: message, status: "error", duration: 3000 });
        }
      } else {
        toast({ title: "Erro ao atualizar status do usuário", status: "error", duration: 3000 });
      }
    }
  };

  // Mutação para deletar usuário
  const deleteMutation = useMutation({
    mutationFn: () => deleteUser(userToDelete!.id.toString()),
    onSuccess: () => {
      toast({ title: "Usuário deletado!", status: "success", duration: 3000 });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error) && error.response?.data) {
        const { message } = error.response.data;
        if (message) {
          toast({ title: message, status: "error", duration: 3000 });
        }
      } else {
        toast({ title: "Erro desconhecido ao deletar usuário", status: "error", duration: 3000 });
      }
    },
  });

  return (
    <Box p={5}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Heading mb={5}>Usuários</Heading>
        {auth?.user?.profile !== "aluno" && (
          <Button colorScheme="blue" onClick={() => { setUserToEdit(null); setIsOpen(true); }}>
            Criar Novo Usuário
          </Button>
        )}
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
              <Td>
                {auth?.user?.id?.toString() !== user.id.toString() && (
                  <Box display="flex" justifyContent="center">
                    <IconButton
                      size="sm"
                      onClick={() => toggleUserStatus(user.id.toString(), user.situacao)}
                      colorScheme={user.situacao === "inativo" ? "yellow" : "green"}
                      icon={user.situacao === "inativo" ? <CloseIcon /> : <CheckIcon />}
                      aria-label={user.situacao === "ativo" ? "Inativar" : "Ativar"}
                      title={user.situacao === "ativo" ? "Inativar Usuário" : "Ativar Usuário"}
                    />
                    <IconButton
                      size="sm"
                      ml={2}
                      colorScheme="blue"
                      icon={<EditIcon />}
                      aria-label="Editar"
                      title="Editar Usuário"
                      onClick={() => { setUserToEdit(user); setIsOpen(true); }}
                    />
                    {/* Exibir botão de deletar apenas para administradores */}
                    {auth?.user?.profile === "admin" && (
                      <IconButton
                        size="sm"
                        ml={2}
                        colorScheme="red"
                        icon={<DeleteIcon />}
                        aria-label="Excluir"
                        title="Excluir Usuário"
                        onClick={() => { setUserToDelete(user); setIsDeleteModalOpen(true); }}
                      />
                    )}
                  </Box>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Modal de Usuário */}
      <UserModal
        isOpen={isOpen}
        onClose={() => { setIsOpen(false); setUserToEdit(null); }}
        onSubmit={mutation.mutate}
        apiErrors={apiErrors}
        isLoading={mutation.isPending}
        userRole={auth?.user?.profile || "aluno"}
        userToEdit={userToEdit}
      />

      {/* Modal de Confirmação de Exclusão */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmar Exclusão</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Tem certeza que deseja excluir o usuário <strong>{userToDelete?.nome}</strong>?
            Essa ação não pode ser desfeita.
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={() => deleteMutation.mutate()} isLoading={deleteMutation.isPending}>
              Excluir
            </Button>
            <Button ml={3} onClick={() => setIsDeleteModalOpen(false)}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}