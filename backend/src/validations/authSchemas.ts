import { z } from "zod";

export const registerSchema = z.object({
    nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
    usuario: z.string().min(3, "O nome de usuário deve ter pelo menos 3 caracteres"),
    senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    perfil: z.enum(["admin", "professor", "aluno"], {
        message: "O perfil deve ser um dos seguintes: admin, professor, aluno",
    }),
});

export const loginSchema = z.object({
    usuario: z.string().min(3, "Usuário ou Senha incorretos"),
    senha: z.string().min(6, "Usuário ou Senha incorretos"),
});

export const refreshSchema = z.object({
    refreshToken: z.string().min(10, "Token de atualização inválido"),
});

export const logoutSchema = z.object({
    refreshToken: z.string().min(10, "Token de atualização inválido"),
});
