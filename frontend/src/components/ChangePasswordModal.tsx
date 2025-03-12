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
}

export default function ChangePasswordModal({ isOpen, onClose, id }: ChangePasswordModalProps) {
  const [newPassword, setNewPassword] = useState("");
  const [apiErrors, setApiErrors] = useState<string[]>([]);
  const toast = useToast();

  // Configuração da mutação para atualizar a senha
  const mutation = useMutation({
    mutationFn: () => updatePassword(id, newPassword),
    onSuccess: () => {
      toast({ title: "Senha alterada com sucesso!", status: "success", duration: 3000 });
      setNewPassword("");
      setApiErrors([]);
      onClose();
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.data) {
        const { message, errors } = error.response.data;

        if (errors && Array.isArray(errors)) {
          // Extrair erros de validação da API
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
          {/* Exibir erros de validação */}
          {apiErrors.length > 0 && (
            <Box bg="red.900" p={3} borderRadius="md" mb={3}>
              <UnorderedList color="white">
                {apiErrors.map((err, index) => (
                  <ListItem key={index}>{err}</ListItem>
                ))}
              </UnorderedList>
            </Box>
          )}

          <FormControl isInvalid={apiErrors.length > 0}>
            <FormLabel>Nova Senha</FormLabel>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
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
