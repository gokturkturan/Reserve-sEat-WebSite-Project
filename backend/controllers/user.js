import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/user.js";
import generateToken from "../utils/generateToken.js";
import Restaurant from "../models/restaurant.js";

// @desc    Register User
// @route   POST /api/users/register
const register = asyncHandler(async (req, res) => {
  const { name, email, phone, password, type } = req.body;
  if (type === "user") {
    const isUserRegistered = await User.findOne({ email });
    if (isUserRegistered) {
      res.status(400);
      throw new Error("Bu e-posta adresi kullanılmaktadır.");
    }

    const user = await User.create({ name, email, phone, password });
    if (user) {
      generateToken(res, user._id);

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        type: "user",
      });
    } else {
      res.status(400);
      throw new Error("Kayıt gerçekleştirilemedi.");
    }
  } else if (type === "restaurant") {
    const isRestaurantRegistered = await Restaurant.findOne({ email });
    if (isRestaurantRegistered) {
      res.status(400);
      throw new Error("Bu e-posta adresi kullanılmaktadır.");
    }

    const restaurant = await Restaurant.create({
      email,
      password,
      name,
      image: "/uploads/sample.jpg",
      description: "Açıklama",
    });

    if (restaurant) {
      generateToken(res, restaurant._id);

      res.status(201).json({
        _id: restaurant._id,
        name: restaurant.name,
        email: restaurant.email,
        phone: restaurant.phone,
        type: "restaurant",
      });
    } else {
      res.status(400);
      throw new Error("Kayıt gerçekleştirilemedi.");
    }
  }
});

// @desc    Login User
// @route   POST /api/users/login
const login = asyncHandler(async (req, res) => {
  const { email, password, type } = req.body;
  if (type === "user") {
    const user = await User.findOne({ email });
    if (user && (await user.checkPassword(password))) {
      generateToken(res, user._id);

      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        type: "user",
      });
    } else {
      res.status(401);
      throw new Error("E-posta, Şifre ya da Giriş türünüz hatalı.");
    }
  } else if (type === "restaurant") {
    const restaurant = await Restaurant.findOne({ email });
    if (restaurant && (await restaurant.checkPassword(password))) {
      generateToken(res, restaurant._id);

      res.status(200).json({
        _id: restaurant._id,
        name: restaurant.name,
        email: restaurant.email,
        image: restaurant.image,
        description: restaurant.description,
        branches: restaurant.branches,
        reviews: restaurant.reviews,
        rating: restaurant.rating,
        numReviews: restaurant.numReviews,
        type: "restaurant",
      });
    } else {
      res.status(401);
      throw new Error("E-posta, Şifre ya da Giriş türünüz hatalı.");
    }
  } else {
    res.status(401);
    throw new Error("Kullanıcı türü hatalı.");
  }
});

// @desc    Logout User
// @route   POST /api/users/logout
const logout = (req, res) => {
  res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: "Çıkış yapıldı." });
};

// @desc    Get User Profile
// @route   GET /api/users/profile
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
  } else {
    res.status(404);
    throw new Error("Kullanıcı bulunamadı");
  }
});

// @desc    Update User Profile
// @route   PUT /api/users/profile
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
    });
  } else {
    res.status(404);
    throw new Error("Kullanıcı bulunamadı.");
  }
});

const userController = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
};

export default userController;
