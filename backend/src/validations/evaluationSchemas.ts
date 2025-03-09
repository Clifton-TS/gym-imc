import { z } from "zod";

// Schema para validação de dados de avaliação
export const evaluationSchema = z.object({
  altura: z.number().min(0.5, "A altura deve ser maior que 0.5 metros").max(3, "A altura deve ser menor que 3 metros"),
  peso: z.number().min(10, "O peso deve ser maior que 10kg").max(500, "O peso deve ser menor que 500kg"),
});
