import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { User, UserRole } from "../entities/User";
import { UserToken } from "../entities/UserToken";

const SECRET_KEY = process.env.JWT_SECRET || "chave-secreta";

export const AuthService = {

  async login(usuario: string, senha: string) {
    const userRepo = AppDataSource.getRepository(User);
    const userTokenRepo = AppDataSource.getRepository(UserToken);
    
    // Busca o usuário pelo nome de usuário
    const user = await userRepo.findOneBy({ usuario });

    // Verifica se o usuário existe
    if (!user) throw new Error("Usuário ou Senha incorretos");

    // Compara a senha fornecida com a senha armazenada
    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    if (!isPasswordValid) throw new Error("Usuário ou Senha incorretos");

    // Verifica se o usuário está ativo
    if (user.situacao === 'inativo') {
      throw new Error("Usuário inativo");
    }

    // Gera o token de acesso e o token de atualização
    const accessToken = jwt.sign({ id: user.id, perfil: user.perfil }, SECRET_KEY, { expiresIn: "1h" });
    const refreshToken = jwt.sign({ id: user.id, perfil: user.perfil }, SECRET_KEY, { expiresIn: "7d" });

    // Garantir apenas um refresh token por usuário
    await userTokenRepo.delete({ idUsuario: user.id });

    // Salva o token de atualização no banco de dados
    const newToken = userTokenRepo.create({
      refreshToken,
      idUsuario: user.id,
      expiracaoToken: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 dias de validade
    });

    await userTokenRepo.save(newToken);

    // Retorna os tokens gerados e o usuário com nome de usuário e perfil
    return { 
      accessToken, 
      refreshToken, 
      user: {
        id: user.id,
        username: user.usuario, 
        profile: user.perfil,
        name: user.nome
      }
    };
  },

  async register(nome: string, usuario: string, senha: string, perfil: string) {
    const userRepo = AppDataSource.getRepository(User);

    // Criptografa a senha fornecida
    const hashedPassword = await bcrypt.hash(senha, 10);    

    // Cria um novo usuário com os dados fornecidos
    const newUser = userRepo.create({
        nome,
        usuario,
        senha: hashedPassword,
        perfil: perfil as UserRole,
        situacao: "ativo"
      });

    // Salva o novo usuário no banco de dados
    await userRepo.save(newUser);

    // Retorna o novo usuário criado
    return newUser;
  },

  async refreshToken(refreshToken: string) {
    const userTokenRepo = AppDataSource.getRepository(UserToken);
    
    // Busca o refresh token armazenado no banco de dados
    const storedToken = await userTokenRepo.findOneBy({ refreshToken });

    // Verifica se o refresh token existe
    if (!storedToken) {
      throw new Error("Token de atualização inválido");
    }

    try {
      // Verifica e decodifica o refresh token
      const decoded = jwt.verify(refreshToken, SECRET_KEY) as { id: string, perfil: string };

      // Gera um novo token de acesso
      const newAccessToken = jwt.sign({ id: decoded.id, perfil: decoded.perfil }, SECRET_KEY, { expiresIn: "1h" });

      // Retorna o novo token de acesso
      return { accessToken: newAccessToken };
    } catch (error) {
      throw new Error("Token de atualização inválido ou expirado");
    }
  },

  async logout(refreshToken: string) {
    const userTokenRepo = AppDataSource.getRepository(UserToken);
    
    // Deleta o token de atualização do banco de dados
    await userTokenRepo.delete({ refreshToken });
  }
};
