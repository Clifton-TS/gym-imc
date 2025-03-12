import api from "@/services/api";

// Interface para representar um usuário
export interface User {
  id: number;
  nome: string;
  usuario: string;
  perfil: "admin" | "professor" | "aluno";
  situacao: "ativo" | "inativo"; // Novo campo para situação do usuário
}

// Interface para representar um novo usuário
export interface NewUser {
  nome: string;
  usuario: string;
  senha: string;
  perfil: "admin" | "professor" | "aluno";
}

// Função para buscar todos os usuários
export const fetchUsers = async (): Promise<User[]> => {
  const response = await api.get("/users");
  return response.data;
};

// Função para criar um novo usuário
export const createUser = async (newUser: NewUser) => {
  await api.post("/users", newUser);
};

// Função para atualizar a situação de um usuário (ativar/inativar)
export const updateUserStatus = async (usuario: string, situacao: "ativo" | "inativo") => {
  await api.put(`/users/${usuario}`, { situacao });
};
