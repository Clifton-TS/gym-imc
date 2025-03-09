import { z } from "zod";

// Schema para criar um novo usuário
export const createUserSchema = z.object({
    nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
    usuario: z.string().min(3, "O usuário deve ter pelo menos 3 caracteres"),
    senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    perfil: z.enum(["admin", "professor", "aluno"], {
        message: "O perfil deve ser um dos seguintes: admin, professor, aluno",
    })
});

// Schema para atualizar um usuário
export const updateUserSchema = z.object({
    nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres").optional(),
    usuario: z.string().min(3, "O usuário deve ter pelo menos 3 caracteres").optional(),
    senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres").optional(),
    perfil: z.enum(["admin", "professor", "aluno"]).optional(),
    situacao: z.enum(["ativo", "inativo"]).optional(),
});

// Schema para mudar a senha
export const changePasswordSchema = z.object({
    currentPassword: z.string().min(6, "A senha atual é obrigatória"),
    newPassword: z.string().min(6, "A nova senha deve ter pelo menos 6 caracteres"),
});
