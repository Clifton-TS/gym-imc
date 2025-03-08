import { Router } from "express";
import { AuthService } from "../services/authService";

const router = Router();

// Rota para login
router.post("/login", async (req, res) => {
  try {
    const { usuario, senha } = req.body;
    const result = await AuthService.login(usuario, senha);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Rota para registro de novo usuário
router.post("/register", async (req, res) => {
  try {
    const { nome, usuario, senha, perfil } = req.body;
    const newUser = await AuthService.register(nome, usuario, senha, perfil);
    res.status(201).json(newUser);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
