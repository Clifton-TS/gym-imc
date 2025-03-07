import { z } from "zod";

export const userSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  usuario: z.string().min(3, "O usuário deve ter pelo menos 3 caracteres"),
  senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  perfil: z.enum(["admin", "aluno", "professor"]),
  situacao: z.enum(["ativo", "inativo"]),
});
