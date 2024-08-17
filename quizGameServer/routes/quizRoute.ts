import express from "express";
import controller from "../controllers/quizController";

const router = express.Router();

router.get("/generate", controller.generate);
router.get("/:id", controller.getQuizSetById);

export default router;
