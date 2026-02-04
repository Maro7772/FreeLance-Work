import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// @desc    Auth user & get token (Login)
// @route   POST /api/users/login
// @access  Public
export const authUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      image: user.image,
      token: generateToken(user._id)
    });
  } else {
    res
      .status(401)
      .json({ message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
  }
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({ message: "هذا المستخدم مسجل بالفعل" });
    return;
  }

  const user = await User.create({
    name,
    email,
    password
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id)
    });
  } else {
    res.status(400).json({ message: "بيانات المستخدم غير صحيحة" });
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  const users = await User.find({});
  res.json(users);
};

// @desc    Update user (Make Admin)
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin =
      req.body.isAdmin !== undefined ? req.body.isAdmin : user.isAdmin;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id)
    });
  } else {
    res.status(404).json({ message: "هذا المستخدم غير موجود" });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      isAdmin: user.isAdmin
    });
  } else {
    res.status(404).json({ message: "هذا المستخدم غير موجود" });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.image !== undefined) {
      user.image = req.body.image;
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      image: updatedUser.image,
      token: generateToken(updatedUser._id)
    });
  } else {
    res.status(404).json({ message: "هذا المستخدم غير موجود" });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error("لا يمكن حذف المشرفين");
    }
    await user.deleteOne();
    res.json({ message: "تم حذف المستخدم بنجاح" });
  } else {
    res.status(404);
    throw new Error("المستخدم غير موجود");
  }
};
