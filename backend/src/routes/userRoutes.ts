import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { authenticateToken } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/authorize";
import bcrypt from "bcryptjs";
import { changePasswordSchema, createUserSchema, updateUserSchema } from "../validations/userSchemas";
import { validate } from "../middlewares/validate";

const router = Router();
const userRepo = AppDataSource.getRepository(User);

// Rota para obter todos os usuários (Admin ou Professores)
router.get("/", authenticateToken, authorize(["admin", "professor"]), async (req: Request, res: Response) => {
  const userRepo = AppDataSource.getRepository(User);
  const requester = (req as any).user;

  let users;

  if (requester.perfil === "admin") {
    // Admins podem ver todos os usuários
    users = await userRepo.find();
  } else if (requester.perfil === "professor") {
    // Professores só podem ver alunos
    users = await userRepo.find({ where: { perfil: "aluno" } });
  }

  res.json(users);
});

// Obter usuário por username (Admin, o próprio usuário ou Professores visualizando alunos)
router.get("/:usuario", authenticateToken, async (req: Request, res: Response) => {
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
});

// Rota para criar um novo usuário (Admin pode criar qualquer um, Professor só pode criar alunos)
router.post("/", authenticateToken, authorize(["admin", "professor"]), validate(createUserSchema), async (req: Request, res: Response) => {
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
});

// Rota para atualizar um usuário (Admin pode editar qualquer usuário; Professores podem editar alunos)
router.put("/:usuario", authenticateToken, authorize(["admin", "professor"]), validate(updateUserSchema), async (req: Request, res: Response) => {
  const user = await userRepo.findOneBy({ usuario: req.params.usuario });

  if (!user) {
    res.status(404).json({ message: "Usuário não encontrado" });
    return;
  }

  const requester = (req as any).user;

  if (requester.perfil === "professor" && user.perfil !== "aluno") {
    res.status(403).json({ message: "Professores só podem editar alunos" });
    return;
  }

  await userRepo.update(user.id, req.body);
  res.json({ message: "Usuário atualizado com sucesso" });
});

// Rota para deletar um usuário (Apenas Admin e não pode deletar usuários com avaliações)
router.delete("/:usuario", authenticateToken, authorize(["admin"]), async (req: Request, res: Response) => {
  const user = await userRepo.findOneBy({ usuario: req.params.usuario });

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
});

// Rota para alterar a senha (Admins podem alterar de qualquer um, Professores podem alterar de alunos, Usuários podem alterar a própria senha)
router.put("/:usuario/change-password", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const requester = (req as any).user;
    const user = await userRepo.findOneBy({ usuario: req.params.usuario });

    if (!user) {
      res.status(404).json({ message: "Usuário não encontrado" });
      return;
    }

    // Verifica se o solicitante tem permissão para alterar a senha
    const canChangePassword = 
      requester.perfil === "admin" ||
      (requester.perfil === "professor" && user.perfil === "aluno") ||
      requester.id ===  user.id;

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
});

export default router;