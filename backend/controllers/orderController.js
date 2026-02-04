import Order from "../models/Order.js";
import Product from "../models/Product.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("لا توجد منتجات في الطلب");
  } else {
    const order = new Order({
      orderItems: orderItems.map((x) => ({
        ...x,
        product: x.product || x._id,
        _id: undefined
      })),
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    });

    const createdOrder = await order.save();

    for (const item of orderItems) {
      const productId = item.product || item._id;
      const product = await Product.findById(productId);
      if (product) {
        if (product.countInStock < item.qty) {
          res.status(400);
          throw new Error(
            `عذراً، الكمية المطلوبة من ${product.name} غير متوفرة`
          );
        }
        product.countInStock -= item.qty;
        await product.save();
      }
    }

    res.status(201).json(createdOrder);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (order) {
    if (req.user.isAdmin || order.user._id.equals(req.user._id)) {
      res.json(order);
    } else {
      res.status(401).json({ message: "غير مصرح لك برؤية هذا الطلب" });
    }
  } else {
    res.status(404).json({ message: "الطلب غير موجود" });
  }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
export const updateOrderToDelivered = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.isPaid = true;
    order.paidAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: "الطلب غير موجود" });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res) => {
  const orders = await Order.find({})
    .populate("user", "id name")
    .sort({ createdAt: -1 });
  res.json(orders);
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private
export const deleteOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    if (req.user.isAdmin || order.user.equals(req.user._id)) {
      if (!req.user.isAdmin && order.isDelivered) {
        res.status(400);
        throw new Error(
          "لا يمكن حذف طلب تم توصيله بالفعل، يرجى التواصل مع خدمة العملاء للإرجاع"
        );
      }

      for (const item of order.orderItems) {
        const product = await Product.findById(item.product);
        if (product) {
          product.countInStock += item.qty;
          await product.save();
        }
      }

      await order.deleteOne();
      res.json({ message: "تم حذف الطلب وإرجاع المنتجات للمخزن" });
    } else {
      res.status(401);
      throw new Error("غير مصرح لك بحذف هذا الطلب");
    }
  } else {
    res.status(404);
    throw new Error("الطلب غير موجود");
  }
};
