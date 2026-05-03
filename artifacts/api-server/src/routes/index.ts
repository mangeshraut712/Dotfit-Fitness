import { Router, type IRouter } from "express";
import healthRouter from "./health";
import contactsRouter from "./contacts";
import openrouterRouter from "./openrouter";

const router: IRouter = Router();

router.use(healthRouter);
router.use(contactsRouter);
router.use("/openrouter", openrouterRouter);

export default router;
