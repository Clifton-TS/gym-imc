import api from "@/services/api";

// Interface para representar um usuário
export interface User {
  id: number;
  nome: string;
  usuario: string;
  perfil: "admin" | "professor" | "aluno";
  situacao: "ativo" | "inativo"; // Novo campo para situação do usuário
}

// Interface para representar um novo usuário ou edição de usuário
export interface NewUser {
  nome: string;
  usuario: string;
  senha?: string; // Senha é opcional para edição
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

// Função para atualizar um usuário existente
export const updateUser = async (id: string, updatedUser: NewUser) => {
  await api.put(`/users/${id}`, updatedUser);
};

// Função para atualizar a situação de um usuário (ativar/inativar)
export const updateUserStatus = async (id: string, situacao: "ativo" | "inativo") => {
    await api.put(`/users/${id}`, { situacao });
};

// Função para atualizar a senha de um usuário
export const updatePassword = async (id: string, currentPassword: string, newPassword: string) => {
  if(currentPassword) {
    await api.put(`/users/${id}/change-password`, { currentPassword, newPassword });
  } else {
    await api.put(`/users/${id}/change-password`, { newPassword });
  }
};


// Função para deletar usuário
export const deleteUser = async (id: string) => {
  await api.delete(`/users/${id}`);
};

