import { useEffect } from "react";
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

const userSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  usuario: z.string().min(3, "O usuário deve ter pelo menos 3 caracteres"),
  senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres").optional(), // Senha não obrigatória para edição
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
  userToEdit?: User | null; // New prop for editing
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

  // If editing, prefill form fields
  useEffect(() => {
    if (userToEdit) {
      setValue("nome", userToEdit.nome);
      setValue("usuario", userToEdit.usuario);
      setValue("perfil", userToEdit.perfil);
    }
  }, [userToEdit, setValue]);

  // Reset form when closing the modal
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{userToEdit ? "Editar Usuário" : "Criar Usuário"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {apiErrors.length > 0 && (
            <Box bg="red.50" p={3} borderRadius="md" mb={3}>
              <UnorderedList color="red.500">
                {apiErrors.map((err, index) => (
                  <ListItem key={index}>{err}</ListItem>
                ))}
              </UnorderedList>
            </Box>
          )}

          <FormControl mb={3} isInvalid={!!errors.nome}>
            <FormLabel>Nome</FormLabel>
            <Input {...register("nome")} />
            <Box color="red.500">{errors.nome?.message}</Box>
          </FormControl>

          <FormControl mb={3} isInvalid={!!errors.usuario}>
            <FormLabel>Usuário</FormLabel>
            <Input {...register("usuario")} /> {/* Cannot edit username */}
            <Box color="red.500">{errors.usuario?.message}</Box>
          </FormControl>

          {!userToEdit && ( // Show password field only for new users
            <FormControl mb={3} isInvalid={!!errors.senha}>
              <FormLabel>Senha</FormLabel>
              <Input type="password" {...register("senha")} />
              <Box color="red.500">{errors.senha?.message}</Box>
            </FormControl>
          )}

          <FormControl mb={3} isInvalid={!!errors.perfil}>
            <FormLabel>Perfil</FormLabel>
            <Select placeholder="Selecione um perfil" {...register("perfil")} disabled={userRole === "professor"}>
              <option value="admin">Admin</option>
              <option value="professor">Professor</option>
              <option value="aluno">Aluno</option>
            </Select>
            <Box color="red.500">{errors.perfil?.message}</Box>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleSubmit(onSubmit)} isLoading={isLoading}>
            {userToEdit ? "Salvar Alterações" : "Criar"}
          </Button>
          <Button ml={3} onClick={onClose}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
