import { Router } from "express";
import { authenticateToken } from "../middlewares/authMiddleware";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";

const router = Router();

router.get("/", authenticateToken, async (req, res) => {
  const userRepo = AppDataSource.getRepository(User);
  const users = await userRepo.find();
  res.json(users);
});

export default router;
