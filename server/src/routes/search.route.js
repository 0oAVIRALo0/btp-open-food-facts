import { Router } from "express";
import {
  searchCategories,
  searchResult,
  getDocumentById,
} from "../controllers/search.controller.js";

const router = Router();

router.route("/categories").get(searchCategories);
router.route("/search-result").post(searchResult);
router.route("/document/:id").get(getDocumentById);

export default router;
