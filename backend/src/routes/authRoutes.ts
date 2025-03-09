import { Router } from "express";
import { validate } from "../middlewares/validate";
import { registerSchema, loginSchema, refreshSchema, logoutSchema } from "../validations/authSchemas";
import { AuthController } from "../controllers/authController";

const router = Router();

router.post("/login", validate(loginSchema), AuthController.login);
router.post("/refresh", validate(refreshSchema), AuthController.refresh);
router.post("/logout", validate(logoutSchema), AuthController.logout);
router.post("/register", validate(registerSchema), AuthController.register);

export default router;
