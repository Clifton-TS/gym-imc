import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

export const validate =
  (schema: ZodSchema<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      // Tenta validar o corpo da requisição
      schema.parse(req.body);
      next(); // Se a validação for bem-sucedida, passa para o próximo middleware
    } catch (error) {
      if (error instanceof ZodError) {
        // Formata as mensagens de erro para retornar apenas informações relevantes
        const formattedErrors = error.errors.map((err) => ({
          field: err.path[0],
          message: err.message,
        }));

        // Retorna uma resposta de erro de validação com status 400
        res.status(400).json({
          message: "Validation error",
          errors: formattedErrors,
        });
        return;
      }

      // Se ocorrer um erro inesperado, retorna uma resposta de erro
      res.status(500).json({ message: "Internal Server Error" });
      return;
    }
  };