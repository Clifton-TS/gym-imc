import { useState } from "react";
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
  Box,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { updatePassword } from "@/services/userService";
import { useToast } from "@chakra-ui/react";
import axios from "axios";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  id: string;
  requiresCurrentPassword?: boolean; // 🔥 Nova prop para definir se a senha atual deve ser exigida
}

export default function ChangePasswordModal({ isOpen, onClose, id, requiresCurrentPassword = false }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [apiErrors, setApiErrors] = useState<string[]>([]);
  const toast = useToast();

  const mutation = useMutation({
    mutationFn: () => updatePassword(id, currentPassword, newPassword),
    onSuccess: () => {
      toast({ title: "Senha alterada com sucesso!", status: "success", duration: 3000 });
      setCurrentPassword("");
      setNewPassword("");
      setApiErrors([]);
      onClose();
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.data) {
        const { message, errors } = error.response.data;

        if (errors && Array.isArray(errors)) {
          setApiErrors(errors.map((err: { message: string }) => err.message));
        } else if (message) {
          toast({ title: message, status: "error", duration: 3000 });
        }
      } else {
        toast({ title: "Erro desconhecido ao alterar senha", status: "error", duration: 3000 });
      }
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Alterar Senha</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Exibir erros da API */}
          {apiErrors.length > 0 && (
            <Box bg="red.50" p={3} borderRadius="md" mb={3}>
              <UnorderedList color="red.500">
                {apiErrors.map((err, index) => (
                  <ListItem key={index}>{err}</ListItem>
                ))}
              </UnorderedList>
            </Box>
          )}

          {/* Campo de senha atual (somente se for necessário) */}
          {requiresCurrentPassword && (
            <FormControl mb={3}>
              <FormLabel>Senha Atual</FormLabel>
              <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
            </FormControl>
          )}

          <FormControl>
            <FormLabel>Nova Senha</FormLabel>
            <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={() => mutation.mutate()} isLoading={mutation.isPending}>
            Confirmar
          </Button>
          <Button ml={3} onClick={onClose}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
