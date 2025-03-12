import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";
import { Like, Not } from "typeorm";

const userRepo = AppDataSource.getRepository(User);

export const UserController = {
  // Função para obter todos os usuários
  async getAllUsers(req: Request, res: Response) {
    const requester = (req as any).user;
    const { nomeSearch, nome, usuarioSearch, usuario, perfil } = req.query;

    let filters: any = {};

    if (nomeSearch) {
      filters.nome = Like(`%${nomeSearch}%`);
    }

    if (nome) {
      filters.nome = nome;
    }

    if (usuarioSearch) {
      filters.usuario = Like(`%${usuarioSearch}%`);
    } 
    
    if (usuario) {
      filters.usuario = usuario;
    }

    if (perfil) {
      filters.perfil = perfil;
    }

    let users;

    if (requester.perfil === "admin") {
      // Admins podem ver todos os usuários, exceto a si mesmos
      users = await userRepo.find({ where: { ...filters, id: Not(requester.id) } });
    } else if (requester.perfil === "professor") {
      // Professores só podem ver alunos
      users = await userRepo.find({ where: { ...filters, perfil: "aluno", id: Not(requester.id) } });
    }

    res.json(users);
  },

  // Função para obter um usuário pelo nome de usuário
  async getUserByUsername(req: Request, res: Response) {
    const user = await userRepo.findOneBy({ usuario: req.params.usuario });

    if (!user) {
      res.status(404).json({ message: "Usuário não encontrado" });
      return;
    }

    const requester = (req as any).user;

    // Admins podem visualizar qualquer usuário
    if (requester.perfil === "admin") {
      res.json(user);
      return;
    }

    // Professores podem visualizar alunos
    if (requester.perfil === "professor" && user.perfil === "aluno") {
      res.json(user);
      return;
    }

    // Usuários podem visualizar seu próprio perfil
    if (requester.id === user.id) {
      res.json(user);
      return;
    }

    // Caso contrário, negar acesso
    res.status(403).json({ message: "Acesso negado" });
    return;
  },

  // Função para criar um novo usuário
  async createUser(req: Request, res: Response) {
    try {
      let { nome, usuario, senha, perfil } = req.body;
      const requester = (req as any).user;

      // Verifica se o nome de usuário já existe
      const existingUser = await userRepo.findOneBy({ usuario });
      if (existingUser) {
        res.status(400).json({ message: "Nome de usuário já existe" });
        return;
      }

      // Professores só podem criar alunos
      if (requester.perfil === "professor") {
        perfil = "aluno"
      }

      // Criptografa a senha antes de salvar
      const hashedPassword = await bcrypt.hash(senha, 10);
      const newUser = userRepo.create({ nome, usuario, senha: hashedPassword, perfil, situacao: 'ativo' });

      await userRepo.save(newUser);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({ message: "Erro ao criar usuário" });
    }
  },

  // Função para atualizar um usuário
  async updateUser(req: Request, res: Response) {
    const user = await userRepo.findOneBy({ id: req.params.id });

    if (!user) {
      res.status(404).json({ message: "Usuário não encontrado" });
      return;
    }

    const requester = (req as any).user;

    if (requester.perfil === "professor" && user.perfil !== "aluno") {
      res.status(403).json({ message: "Professores só podem editar alunos" });
      return;
    }

    // Remove o campo de senha do corpo da requisição, se existir
    const { senha, ...updateData } = req.body;

    await userRepo.update(user.id, updateData);
    res.json({ message: "Usuário atualizado com sucesso" });
  },

  // Função para deletar um usuário
  async deleteUser(req: Request, res: Response) {
    const user = await userRepo.findOneBy({ id: req.params.id });

    if (!user) {
      res.status(404).json({ message: "Usuário não encontrado" });
      return;
    }

    // Verifica se o usuário possui avaliações antes de deletar
    const evaluationRepo = AppDataSource.getRepository("Evaluation");
    const evaluations = await evaluationRepo.count({ where: { idUsuarioAluno: user.id } });

    if (evaluations > 0) {
      res.status(400).json({ message: "Não é possível deletar usuário com avaliações existentes" });
      return;
    }

    await userRepo.remove(user);
    res.json({ message: "Usuário deletado com sucesso" });
  },

  // Função para alterar a senha de um usuário
  async changePassword(req: Request, res: Response) {
    try {
      const { currentPassword, newPassword } = req.body;
      const requester = (req as any).user;
      const user = await userRepo.findOneBy({ id: req.params.id });

      if (!user) {
        res.status(404).json({ message: "Usuário não encontrado" });
        return;
      }

      // Verifica se o solicitante tem permissão para alterar a senha
      const canChangePassword =
        requester.perfil === "admin" ||
        (requester.perfil === "professor" && user.perfil === "aluno") ||
        requester.id === user.id;

      if (!canChangePassword) {
        res.status(403).json({ message: "Acesso negado" });
        return;
      }

      // Se o usuário está alterando a própria senha, verifica a senha atual
      if (requester.id === user.id) {
        const isPasswordValid = await bcrypt.compare(currentPassword, user.senha);
        if (!isPasswordValid) {
          res.status(400).json({ message: "A senha atual está incorreta" });
          return;
        }
      }

      // Criptografa a nova senha e atualiza no banco de dados
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await userRepo.update(user.id, { senha: hashedPassword });
      res.json({ message: "Senha alterada com sucesso" });
      return;
    } catch (error) {
      res.status(500).json({ message: "Erro interno no servidor" });
    }
  },
};
