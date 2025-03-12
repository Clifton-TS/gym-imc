import { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  FormControl,
  FormLabel,
  Select,
  Box,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { NewUser, User } from "@/services/userService";
import ChangePasswordModal from "./ChangePasswordModal"; // Importar o novo modal

// Esquema de validação do usuário
const userSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  usuario: z.string().min(3, "O usuário deve ter pelo menos 3 caracteres"),
  senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres").optional(),
  perfil: z.enum(["admin", "professor", "aluno"], {
    errorMap: () => ({ message: "Perfil inválido" }),
  }),
});

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewUser) => void;
  apiErrors: string[];
  isLoading: boolean;
  userRole: string;
  userToEdit?: User | null;
}

export default function UserModal({ isOpen, onClose, onSubmit, apiErrors, isLoading, userRole, userToEdit }: UserModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<NewUser>({
    resolver: zodResolver(userSchema),
  });

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Se estiver editando, preencher os campos do formulário
  useEffect(() => {
    if (userToEdit) {
      setValue("nome", userToEdit.nome);
      setValue("usuario", userToEdit.usuario);
      setValue("perfil", userToEdit.perfil);
    }
  }, [userToEdit, setValue]);

  // Resetar o formulário quando o modal for fechado
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  // Se o usuário for professor, força o perfil como 'aluno'
  useEffect(() => {
    if (userRole === "professor" && isOpen) {
      setValue("perfil", "aluno");
    }
  }, [userRole, setValue, isOpen]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{userToEdit ? "Editar Usuário" : "Criar Usuário"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {apiErrors.length > 0 && (
              <Box bg="red.50" p={3} borderRadius="md" mb={3}>
                <UnorderedList color="red.300">
                  {apiErrors.map((err, index) => (
                    <ListItem key={index}>{err}</ListItem>
                  ))}
                </UnorderedList>
              </Box>
            )}

            <FormControl mb={3} isInvalid={!!errors.nome}>
              <FormLabel>Nome</FormLabel>
              <Input {...register("nome")} />
              <Box color="red.300">{errors.nome?.message}</Box>
            </FormControl>

            <FormControl mb={3} isInvalid={!!errors.usuario}>
              <FormLabel>Usuário</FormLabel>
              <Input {...register("usuario")} autoComplete="new-password" />
              <Box color="red.300">{errors.usuario?.message}</Box>
            </FormControl>

            {!userToEdit && (
              <FormControl mb={3} isInvalid={!!errors.senha}>
              <FormLabel>Senha</FormLabel>
              <Input type="password" {...register("senha")} autoComplete="new-password" />
              <Box color="red.300">{errors.senha?.message}</Box>
              </FormControl>
            )}

            <FormControl mb={3} isInvalid={!!errors.perfil}>
              <FormLabel>Perfil</FormLabel>
              <Select placeholder="Selecione um perfil" {...register("perfil")} disabled={userRole === "professor"}>
                <option value="admin">Admin</option>
                <option value="professor">Professor</option>
                <option value="aluno">Aluno</option>
              </Select>
              <Box color="red.300">{errors.perfil?.message}</Box>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            {userToEdit && (
              <Button colorScheme="red" onClick={() => setIsPasswordModalOpen(true)}>
                Alterar Senha
              </Button>
            )}
            <Button ml={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button ml={3} colorScheme="blue" onClick={handleSubmit(onSubmit)} isLoading={isLoading}>
              {userToEdit ? "Salvar Alterações" : "Criar"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal de Alteração de Senha */}
      {userToEdit && (
        <ChangePasswordModal
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
          id={userToEdit.id.toString()}
        />
      )}
    </>
  );
}
