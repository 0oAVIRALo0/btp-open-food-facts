import { Router } from "express";
import {
  searchCategories,
  searchResult,
} from "../controllers/search.controller.js";

const router = Router();

router.route("/categories").get(searchCategories);
router.route("/search-result").post(searchResult);

export default router;
