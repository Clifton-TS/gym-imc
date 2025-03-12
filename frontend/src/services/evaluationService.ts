import api from "@/services/api";

// Interface para representar uma avaliação de IMC
export interface Evaluation {
    id: number;
    idUsuarioAluno: string;
    idUsuarioAvaliacao: string;
    altura: number;
    peso: number;
    imc: number;
    classificacao: string;
}

// Interface para representar uma nova avaliação
export interface NewEvaluation {
    idUsuarioAluno: string;
    altura: number;
    peso: number;
}

// Interface para representar uma nova avaliação
export interface NewEvaluation {
    idUsuarioAluno: string;
    altura: number;
    peso: number;
}

// Função para buscar todas as avaliações
export const fetchEvaluations = async (): Promise<Evaluation[]> => {
    const response = await api.get("/evaluations");
    return response.data;
};

// Função para criar uma nova avaliação
export const createEvaluation = async (newEvaluation: NewEvaluation) => {
    const formattedEvaluation = {
        ...newEvaluation,
        altura: newEvaluation.altura / 100,
    };
    await api.post("/evaluations", formattedEvaluation);
};

// Função para atualizar uma avaliação existente
export const updateEvaluation = async (id: string, updatedEvaluation: NewEvaluation) => {
    const formattedEvaluation = {
        ...updatedEvaluation,
        altura: updatedEvaluation.altura / 100,
    };
    await api.put(`/evaluations/${id}`, formattedEvaluation);
};

// Função para deletar uma avaliação
export const deleteEvaluation = async (id: string) => {
    await api.delete(`/evaluations/${id}`);
};

// Interface para representar um usuário (aluno)
export interface Student {
    id: number;
    nome: string;
    usuario: string;
}

// Função para buscar apenas alunos
export const fetchStudents = async (): Promise<Student[]> => {
    const response = await api.get("/users", {
        params: { perfil: "aluno" },
    });
    return response.data;
};
