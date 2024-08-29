import { Router } from "express";
import { predict } from "../controllers/predict.controller.js";

const router = Router();

router.route("/predict-class").post(predict);

export default router;
