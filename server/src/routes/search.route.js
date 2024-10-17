import { Router } from "express";
import {
  searchCategories,
  searchNovaGroups,
  searchAll,
} from "../controllers/search.controller.js";

const router = Router();

router.route("/categories").get(searchCategories);
router.route("/nova-groups").get(searchNovaGroups);
router.route("/all").get(searchAll);

export default router;
