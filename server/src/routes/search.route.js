import { Router } from "express";
import {
  searchMacroClass,
  searchCategoryName,
  searchFoodDescription,
  searchNutrients,
} from "../controllers/search.controller.js";

const router = Router();

router.route("/macro-class").get(searchMacroClass);
router.route("/category").get(searchCategoryName);
router.route("/food-desc").get(searchFoodDescription);
router.route("/nutrient-details").get(searchNutrients);

export default router;
