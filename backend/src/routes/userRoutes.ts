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
router.put("/:usuario", authenticateToken, authorize(["admin", "professor"]), validate(updateUserSchema), UserController.updateUser);
router.delete("/:usuario", authenticateToken, authorize(["admin"]), UserController.deleteUser);
router.put("/:usuario/change-password", authenticateToken, validate(changePasswordSchema), UserController.changePassword);

export default router;