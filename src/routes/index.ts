import { Router } from "express";
import usersRouter from "./user.route";
import courseRouter from "./course.route";

const router = Router();

router.use(usersRouter);
router.use(courseRouter);

export default router;
