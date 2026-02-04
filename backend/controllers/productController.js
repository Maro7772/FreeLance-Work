import Product from "../models/Product.js";

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i"
          }
        }
      : {};

    const categoryFilter = req.query.category
      ? { category: req.query.category }
      : {};

    const products = await Product.find({
      ...keyword,
      ...categoryFilter
    }).populate("category", "name");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      imageCover,
      images,
      category,
      countInStock
    } = req.body;

    if (!name || !price || !imageCover || !category) {
      res.status(400);
      throw new Error("الرجاء إدخال جميع البيانات الأساسية وصورة الغلاف");
    }

    const product = new Product({
      name,
      price,
      user: req.user._id,
      imageCover,
      images,
      category,
      countInStock,
      numReviews: 0,
      description
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: "المنتج غير موجود" });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: "تم حذف المنتج" });
  } else {
    res.status(404).json({ message: "المنتج غير موجود" });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  const {
    name,
    price,
    description,
    imageCover,
    images,
    category,
    countInStock
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.imageCover = imageCover || product.imageCover;
    product.images = images || product.images;
    product.category = category || product.category;
    product.countInStock = countInStock || product.countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404).json({ message: "المنتج غير موجود" });
  }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    // const alreadyReviewed = product.reviews.find(
    //   (r) => r.user.toString() === req.user._id.toString()
    // );

    // if (alreadyReviewed) {
    //   res.status(400);
    //   throw new Error("لقد قمت بتقييم هذا المنتج مسبقاً");
    // }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
      image: req.user.image
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("المنتج غير موجود");
  }
};

// @desc    Delete product review
// @route   DELETE /api/products/:productId/reviews/:reviewId
// @access  Private
export const deleteProductReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (product) {
      const reviewsToKeep = product.reviews.filter(
        (review) => review._id.toString() !== req.params.reviewId.toString()
      );

      product.reviews = reviewsToKeep;

      product.numReviews = product.reviews.length;

      if (product.reviews.length > 0) {
        product.rating =
          product.reviews.reduce((acc, item) => item.rating + acc, 0) /
          product.reviews.length;
      } else {
        product.rating = 0;
      }

      await product.save();
      res.json({ message: "Review removed" });
    } else {
      res.status(404).json({ message: "المنتج غير موجود" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
