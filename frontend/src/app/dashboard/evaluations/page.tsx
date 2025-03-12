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
import EvaluationModal from "@/components/EvaluationModal";
import { fetchEvaluations, createEvaluation, updateEvaluation, deleteEvaluation, Evaluation, NewEvaluation } from "@/services/evaluationService";
import { AuthContext } from "@/contexts/AuthContext";
import { CheckIcon, CloseIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";

export default function Avaliacoes() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [apiErrors, setApiErrors] = useState<string[]>([]);
  const [evaluationToEdit, setEvaluationToEdit] = useState<Evaluation | null>(null);
  const [evaluationToDelete, setEvaluationToDelete] = useState<Evaluation | null>(null);
  const toast = useToast();
  const queryClient = useQueryClient();
  const auth = useContext(AuthContext);

  // Buscar avaliações
  const { data: evaluations, isLoading } = useQuery({
    queryKey: ["evaluations"],
    queryFn: fetchEvaluations,
  });

  // Mutação para criar/atualizar avaliações
  const mutation = useMutation({
    mutationFn: (data: NewEvaluation) => evaluationToEdit ? updateEvaluation(evaluationToEdit.id.toString(), data) : createEvaluation(data),
    onSuccess: () => {
      toast({ title: evaluationToEdit ? "Avaliação atualizada!" : "Avaliação criada!", status: "success", duration: 3000 });
      queryClient.invalidateQueries({ queryKey: ["evaluations"] });
      setApiErrors([]);
      setIsOpen(false);
      setEvaluationToEdit(null);
    },
    onError: (error) => {
      toast({ title: "Erro ao processar avaliação", status: "error", duration: 3000 });
    },
  });

  // Mutação para deletar avaliações
  const deleteMutation = useMutation({
    mutationFn: () => deleteEvaluation(evaluationToDelete!.id.toString()),
    onSuccess: () => {
      toast({ title: "Avaliação deletada!", status: "success", duration: 3000 });
      queryClient.invalidateQueries({ queryKey: ["evaluations"] });
      setIsDeleteModalOpen(false);
      setEvaluationToDelete(null);
    },
    onError: () => {
      toast({ title: "Erro ao deletar avaliação", status: "error", duration: 3000 });
    },
  });

  return (
    <Box p={5}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Heading mb={5}>Avaliações</Heading>
        {auth?.user?.profile !== "aluno" && (
          <Button colorScheme="blue" onClick={() => { setEvaluationToEdit(null); setIsOpen(true); }}>Criar Nova Avaliação</Button>
        )}
      </Box>

      <Table mt={5}>
        <Thead>
            <Tr>
              <Th>Aluno</Th>
              <Th>Altura</Th>
              <Th>Peso</Th>
              <Th>IMC</Th>
              <Th>Classificação</Th>
              {auth?.user?.profile != "aluno" && <Th textAlign={'center'}>Ações</Th>}
            </Tr>
        </Thead>
        <Tbody>
          {evaluations?.map((evaluation) => (
            <Tr key={evaluation.id}>
              <Td>{evaluation.idUsuarioAluno}</Td>
              <Td>{evaluation.altura} m</Td>
              <Td>{evaluation.peso} kg</Td>
              <Td>{evaluation.imc.toFixed(2)}</Td>
              <Td>{evaluation.classificacao}</Td>
                {auth?.user?.profile !== "aluno" && (
                <Td>
                  <Box display="flex" justifyContent="center">
                  <IconButton
                    size="sm"
                    colorScheme="blue"
                    icon={<EditIcon />}
                    aria-label="Editar"
                    title="Editar Avaliação"
                    onClick={() => { setEvaluationToEdit(evaluation); setIsOpen(true); }}
                  />
                  {auth?.user?.profile === "admin" && (
                    <IconButton
                    size="sm"
                    ml={2}
                    colorScheme="red"
                    icon={<DeleteIcon />}
                    aria-label="Excluir"
                    title="Excluir Avaliação"
                    onClick={() => { setEvaluationToDelete(evaluation); setIsDeleteModalOpen(true); }}
                    />
                  )}
                  </Box>
                </Td>
                )}
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Modal de Avaliação */}
      <EvaluationModal
        isOpen={isOpen}
        onClose={() => { setIsOpen(false); setEvaluationToEdit(null); }}
        onSubmit={mutation.mutate}
        apiErrors={apiErrors}
        isLoading={mutation.isPending}
        evaluationToEdit={evaluationToEdit}
      />

      {/* Modal de Confirmação de Exclusão */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmar Exclusão</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Tem certeza que deseja excluir esta avaliação?
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
