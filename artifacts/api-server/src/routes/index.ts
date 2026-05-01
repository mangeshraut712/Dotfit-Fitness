import { Router, type IRouter } from "express";
import healthRouter from "./health";
import contactsRouter from "./contacts";

const router: IRouter = Router();

router.use(healthRouter);
router.use(contactsRouter);

export default router;
