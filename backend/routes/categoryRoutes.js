import express from "express";
import {
  getCategories,
  createCategory,
  deleteCategory
} from "../controllers/categoryController.js";
import { admin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getCategories).post(protect, admin, createCategory);

router.route("/:id").delete(protect, admin, deleteCategory);

export default router;
