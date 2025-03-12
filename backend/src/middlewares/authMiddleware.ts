import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Chave secreta usada para verificar o token JWT
const SECRET_KEY = process.env.JWT_SECRET || "chave-secreta";

// Middleware para autenticar o token JWT
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  // Obtém o token do cabeçalho de autorização
  const token = req.header("Authorization")?.split(" ")[1];

  // Se não houver token, retorna erro 401 (não autorizado)
  if (!token) {
    res.status(401).json({ message: "Acesso negado" });
    return;
  }

  try {
    // Verifica e decodifica o token
    const decoded = jwt.verify(token, SECRET_KEY);
    // Adiciona o usuário decodificado ao objeto de requisição
    (req as any).user = decoded;
    // Chama o próximo middleware
    next();
  } catch (error) {
    // Se o token for inválido, retorna erro 401
    res.status(401).json({ message: "Token inválido" });
    return;
  }
};
