import { Request, Response, NextFunction } from "express";

export const authorize =
  (allowedRoles: string[]) => (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user; // Extraído do JWT

    if (!user) {
      res.status(401).json({ message: "Não autorizado" });
      return 
    }

    if (!allowedRoles.includes(user.perfil)) {
      res.status(403).json({ message: "Acesso negado" });
      return 
    }

    next();
  };
