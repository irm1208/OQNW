import { Router, type IRouter } from "express";
import healthRouter from "./health";
import openaiChatRouter from "./openai/chat";
import adminAuthRouter from "./admin/auth";
import adminDashboardRouter from "./admin/dashboard";
import adminOrdersRouter from "./admin/orders";
import adminCustomersRouter from "./admin/customers";
import adminProductsRouter from "./admin/products";
import adminDiscountsRouter from "./admin/discounts";
import catalogRouter from "./admin/catalog";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/openai", openaiChatRouter);
router.use(adminAuthRouter);
router.use(adminDashboardRouter);
router.use(adminOrdersRouter);
router.use(adminCustomersRouter);
router.use(adminProductsRouter);
router.use(adminDiscountsRouter);
router.use(catalogRouter);

export default router;
