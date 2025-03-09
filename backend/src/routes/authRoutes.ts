import { Router, Request, Response } from "express";
import { AuthService } from "../services/authService";
import { validate } from "../middlewares/validate";
import { registerSchema, loginSchema, refreshSchema, logoutSchema } from "../validations/authSchemas";

const router = Router();

// Rota para login
router.post("/login", validate(loginSchema), async (req: Request, res: Response) => {
  try {
    const { usuario, senha } = req.body;
    const result = await AuthService.login(usuario, senha);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Rota para refresh token
router.post("/refresh", validate(refreshSchema), async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(401).json({ message: "Refresh token required" })
      return 
    };

    const newAccessToken = await AuthService.refreshToken(refreshToken);
    res.json(newAccessToken);
  } catch (error: any) {
    res.status(403).json({ message: error.message });
  }
});

// Rota para logout
router.post("/logout", validate(logoutSchema), async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).json({ message: "Refresh token required" })
      return 
    };

    await AuthService.logout(refreshToken);
    res.json({ message: "Logged out successfully" });
  } catch (error: any) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Rota para registro de novo usuário
router.post("/register", validate(registerSchema),  async (req: Request, res: Response) => {
  try {
    const { nome, usuario, senha, perfil } = req.body;
    const newUser = await AuthService.register(nome, usuario, senha, perfil);
    res.status(201).json(newUser);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
