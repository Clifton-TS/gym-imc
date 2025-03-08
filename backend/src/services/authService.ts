import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { User, UserRole } from "../entities/User";

const SECRET_KEY = process.env.JWT_SECRET || "chave-secreta";

export const AuthService = {
  // Função de login
  async login(usuario: string, senha: string) {
    const userRepo = AppDataSource.getRepository(User);
    
    // Busca o usuário pelo nome de usuário
    const user = await userRepo.findOneBy({ usuario });
    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    // Verifica se a senha está correta
    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    if (!isPasswordValid) {
      throw new Error("Senha incorreta");
    }

    // Gera um token JWT
    const token = jwt.sign({ id: user.id, perfil: user.perfil }, SECRET_KEY, { expiresIn: "1h" });

    return { token, user };
  },

  // Função de registro
  async register(nome: string, usuario: string, senha: string, perfil: string) {
    const userRepo = AppDataSource.getRepository(User);

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(senha, 10);    

    // Cria um novo usuário
    const newUser = userRepo.create({
        nome,
        usuario,
        senha: hashedPassword,
        perfil: perfil as UserRole, // Garantimos que o valor é compatível
        situacao: "ativo"
      });

    // Salva o novo usuário no banco de dados
    await userRepo.save(newUser);

    return newUser;
  }
};
