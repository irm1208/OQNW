import { Router, type IRouter } from "express";
import healthRouter from "./health";
import openaiChatRouter from "./openai/chat";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/openai", openaiChatRouter);

export default router;
