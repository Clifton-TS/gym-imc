import { Request, Response } from "express";
import { AuthService } from "../services/authService";

export const AuthController = {
  // Método para login de usuário
  async login(req: Request, res: Response) {
    try {
      const { usuario, senha } = req.body;
      const result = await AuthService.login(usuario, senha);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  // Método para renovar o token de acesso
  async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        res.status(401).json({ message: "Token de atualização necessário" });
        return;
      }

      const newAccessToken = await AuthService.refreshToken(refreshToken);
      res.json(newAccessToken);
    } catch (error: any) {
      res.status(403).json({ message: error.message });
    }
  },

  // Método para logout de usuário
  async logout(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        res.status(400).json({ message: "Token de atualização necessário" });
        return;
      }

      await AuthService.logout(refreshToken);
      res.json({ message: "Desconectado com sucesso" });
    } catch (error: any) {
      res.status(500).json({ message: "Erro Interno do Servidor" });
    }
  },

  // Método para registro de novo usuário
  async register(req: Request, res: Response) {
    try {
      const { nome, usuario, senha, perfil } = req.body;
      const newUser = await AuthService.register(nome, usuario, senha, perfil);
      res.status(201).json(newUser);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
};
