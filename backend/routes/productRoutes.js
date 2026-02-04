import express from "express";
import {
  getProducts,
  createProduct,
  getProductById,
  deleteProduct,
  updateProduct,
  createProductReview,
  deleteProductReview
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getProducts).post(protect, admin, createProduct);

router.route("/:id/reviews").post(protect, createProductReview);

router
  .route("/:id")
  .get(getProductById)
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct);

router
  .route("/:productId/reviews/:reviewId")
  .delete(protect, deleteProductReview);

export default router;
