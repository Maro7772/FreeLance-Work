import express from "express";
import {
  getCategories,
  createCategory
} from "../controllers/categoryController.js";
import { admin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getCategories).post(protect, admin, createCategory);

export default router;
