import { Router, type IRouter } from "express";
import healthRouter from "./health";
import newsRouter from "./news";
import facultyRouter from "./faculty";
import galleryRouter from "./gallery";
import admissionsRouter from "./admissions";
import contactsRouter from "./contacts";
import statsRouter from "./stats";
import openaiRouter from "./openai";
import adminRouter from "./admin";
import paymentsRouter from "./payments";

const router: IRouter = Router();

router.use(healthRouter);
router.use(newsRouter);
router.use(facultyRouter);
router.use(galleryRouter);
router.use(admissionsRouter);
router.use(contactsRouter);
router.use(statsRouter);
router.use(openaiRouter);
router.use(paymentsRouter);
router.use(adminRouter);

export default router;
