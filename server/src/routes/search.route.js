import { Router } from "express";
import {
  searchResult,
  getDocumentById,
  getBrandNameByCategory,
  getProductNameByCategoryBrand,
  getUniqueCategories,
  getUniqueBrands,
  getUniqueProductNames,
} from "../controllers/search.controller.js";

const router = Router();

router.route("/search-result").post(searchResult);
router.route("/document/:id").get(getDocumentById);
router.route("/getBrandByCategory").get(getBrandNameByCategory);
router.route("/product-name-by-category-brand").post(getProductNameByCategoryBrand);
router.route("/unique-categories").get(getUniqueCategories);
router.route("/unique-brands").get(getUniqueBrands);
router.route("/unique-product-names").get(getUniqueProductNames);

export default router;
