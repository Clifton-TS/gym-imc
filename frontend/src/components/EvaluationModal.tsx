import { useEffect} from "react";
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
import { NewEvaluation, Evaluation } from "@/services/evaluationService";
import { useQuery } from "@tanstack/react-query";
import { fetchUsers, User } from "@/services/userService";

// Esquema de validação da avaliação
const evaluationSchema = z.object({
  idUsuarioAluno: z.string().nonempty("Selecione um aluno"),
  altura: z.number().min(50, "Altura deve ser maior que 50 centímetros").max(2501231, "Altura deve ser menor que 250 centímetros"),
  peso: z.number().min(20, "Peso deve ser maior que 20 kg").max(300, "Peso deve ser menor que 300 kg"),
});

interface EvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewEvaluation) => void;
  apiErrors: string[];
  isLoading: boolean;
  evaluationToEdit?: Evaluation | null;
}

export default function EvaluationModal({ isOpen, onClose, onSubmit, apiErrors, isLoading, evaluationToEdit }: EvaluationModalProps) {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<NewEvaluation>({
    resolver: zodResolver(evaluationSchema),
  });

  // Buscar lista de alunos via API
  const { data: students, isLoading: isLoadingStudents } = useQuery({
    queryKey: ["students"],
    queryFn: () => fetchUsers({ perfil: "aluno" }), // Updated query function
  });

  // Preencher o formulário ao editar uma avaliação
  useEffect(() => {
    if (evaluationToEdit) {
      setValue("idUsuarioAluno", evaluationToEdit.idUsuarioAluno);
      setValue("altura", evaluationToEdit.altura*100);
      setValue("peso", evaluationToEdit.peso);
    }
  }, [evaluationToEdit, setValue]);

  // Resetar formulário ao fechar o modal
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{evaluationToEdit ? "Editar Avaliação" : "Criar Avaliação"}</ModalHeader>
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

          {/* Dropdown de alunos */}
          <FormControl mb={3} isInvalid={!!errors.idUsuarioAluno}>
            <FormLabel>Aluno</FormLabel>
            <Select {...register("idUsuarioAluno")} disabled={!!evaluationToEdit}>
              <option value="">Selecione um aluno</option>
              {isLoadingStudents ? (
                <option>Carregando alunos...</option>
              ) : (
                students?.map((student: User) => (
                  <option key={student.id} value={student.id.toString()}>
                    {student.nome} ({student.usuario})
                  </option>
                ))
              )}
            </Select>
            <Box color="red.500">{errors.idUsuarioAluno?.message}</Box>
          </FormControl>

          <FormControl mb={3} isInvalid={!!errors.altura}>
            <FormLabel>Altura (cm)</FormLabel>
            <Input
                type="number"
                step="0.01"
                maxLength={3}
                {...register("altura", {
                valueAsNumber: true,
                onChange: (e) => {
                    if (e.target.value.length > 3) {
                    e.target.value = e.target.value.slice(0, 3); // Mantém apenas os primeiros 3 caracteres
                    }
                },
                })}
            />
            <Box color="red.500">{errors.altura?.message}</Box>
        </FormControl>

          <FormControl mb={3} isInvalid={!!errors.peso}>
            <FormLabel>Peso (kg)</FormLabel>
            <Input type="number" step="0.1" {...register("peso", { valueAsNumber: true })} />
            <Box color="red.500">{errors.peso?.message}</Box>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleSubmit(onSubmit)} isLoading={isLoading}>
            {evaluationToEdit ? "Salvar Alterações" : "Criar"}
          </Button>
          <Button ml={3} onClick={onClose}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
