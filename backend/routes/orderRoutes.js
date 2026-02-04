import express from "express";
import {
  addOrderItems,
  getOrderById,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  deleteOrder
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, addOrderItems).get(protect, admin, getOrders);

router.route("/my-orders").get(protect, getMyOrders);

router.route("/:id").delete(protect, deleteOrder).get(protect, getOrderById);

router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered);

export default router;
