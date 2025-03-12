import { Router } from "express";
import { authenticateToken } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/authorize";
import { validate } from "../middlewares/validate";
import { changePasswordSchema, createUserSchema, updateUserSchema } from "../validations/userSchemas";
import { UserController } from "../controllers/userController";

const router = Router();

router.get("/", authenticateToken, authorize(["admin", "professor"]), UserController.getAllUsers);
router.post("/", authenticateToken, authorize(["admin", "professor"]), validate(createUserSchema), UserController.createUser);
router.get("/:usuario", authenticateToken, UserController.getUserByUsername);
router.put("/:id", authenticateToken, authorize(["admin", "professor"]), validate(updateUserSchema), UserController.updateUser);
router.delete("/:id", authenticateToken, authorize(["admin"]), UserController.deleteUser);
router.put("/:id/change-password", authenticateToken, validate(changePasswordSchema), UserController.changePassword);

export default router;