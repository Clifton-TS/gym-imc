import { Router } from "express";
import { authenticateToken } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/authorize";
import { EvaluationController } from "../controllers/evaluationController";
import { validate } from "../middlewares/validate";
import { evaluationSchema } from "../validations/evaluationSchemas";

const router = Router();

router.post("/", authenticateToken, authorize(["admin", "professor"]), validate(evaluationSchema), EvaluationController.createEvaluation);
router.get("/", authenticateToken, EvaluationController.getEvaluations);
router.put("/:id", authenticateToken, authorize(["admin", "professor"]), validate(evaluationSchema), EvaluationController.updateEvaluation);
router.delete("/:id", authenticateToken, authorize(["admin"]), EvaluationController.deleteEvaluation);

export default router;
