import asyncHandler from "../middleware/asyncHandler.js";
import Restaurant from "../models/restaurant.js";
import customLog from "../utils/log.js";

const getAllRestaurants = asyncHandler(async (req, res) => {
  const perPage = 1;
  const pageNumber = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: "i" } }
    : {};

  const totalRestaurantNumber = await Restaurant.countDocuments(keyword);

  const restaurants = await Restaurant.find(keyword)
    .skip((pageNumber - 1) * perPage)
    .limit(perPage);
  res.status(200).json({
    restaurants,
    page: pageNumber,
    numberOfPage: Math.ceil(totalRestaurantNumber / perPage),
  });
});

const getRestaurant = asyncHandler(async (req, res) => {
  const restaurantId = req.params.id;
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    res.status(404);
    throw new Error("Ürün bulunamadı.");
  }
  res.status(200).json(restaurant);
});

const sendRestaurantReview = asyncHandler(async (req, res) => {
  const restaurantId = req.params.id;
  const { rating, comment } = req.body;
  const restaurant = await Restaurant.findById(restaurantId);
  if (restaurant) {
    const alreadyReviewed = restaurant.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      res.status(404);
      throw new Error("Bu restorant zaten değerlendirilmiş.");
    }
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };
    restaurant.reviews.push(review);
    restaurant.numReviews = restaurant.reviews.length;
    restaurant.rating =
      restaurant.reviews.reduce((acc, review) => acc + review.rating, 0) /
      restaurant.reviews.length;
    await restaurant.save();
    customLog(
      `The user named ${req.user.name} sent a review to the restaurant named ${restaurant.name}.`
    );
    res.status(200).json({ message: "Restorant başarıyla değerlendirildi." });
  } else {
    res.status(404);
    throw new Error("Restorant bulunamadı.");
  }
});

const createBranch = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.user._id);

  if (!restaurant) {
    res.status(404);
    throw new Error("Restorant bulunamadı.");
  }

  const branch = {
    name: "Şube",
    address: "Adres",
    phoneNumber: "05050505050",
    workingHours: "00:00-00:00",
  };

  restaurant.branches.push(branch);

  const updatedRestaurant = await restaurant.save();
  const newBranch =
    updatedRestaurant.branches[updatedRestaurant.branches.length - 1];
  customLog(`The restaurant named ${req.user.name} created a branch.`);
  res.status(201).json(newBranch);
});

const getBranches = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.user.id);
  if (!restaurant) {
    res.status(404);
    throw new Error("Restorant bulunamadı.");
  }
  res.status(200).json({ branches: restaurant.branches });
});

const deleteBranch = asyncHandler(async (req, res) => {
  const branchId = req.params.id;
  const restaurant = await Restaurant.findById(req.user._id);
  if (restaurant) {
    const branchIndex = restaurant.branches.findIndex(
      (branch) => branch._id.toString() === branchId
    );
    if (branchIndex === -1) {
      res.status(404);
      throw new Error("Şube bulunamadı.");
    }
    restaurant.branches.splice(branchIndex, 1);
    await restaurant.save();
    customLog(`The restaurant named ${req.user.name} deleted a branch.`);
    res.status(200).json({ message: "Şube başarıyla silindi." });
  } else {
    res.status(404);
    throw new Error("Restorant bulunamadı.");
  }
});

const getBranch = asyncHandler(async (req, res) => {
  const branchId = req.params.id;
  const restaurant = await Restaurant.findById(req.user.id);
  if (!restaurant) {
    res.status(404);
    throw new Error("Restorant bulunamadı.");
  }

  const branch = restaurant.branches.find(
    (branch) => branch._id.toString() === branchId
  );

  if (!branch) {
    res.status(404);
    throw new Error("Şube bulunamadı.");
  }

  res.status(200).json(branch);
});

const editBranch = asyncHandler(async (req, res) => {
  const { name, address, phoneNumber, workingHours } = req.body;
  const branchId = req.params.id;

  const restaurant = await Restaurant.findById(req.user._id);

  if (restaurant) {
    const branch = restaurant.branches.find(
      (branch) => branch._id.toString() === branchId
    );

    if (!branch) {
      res.status(404);
      throw new Error("Şube bulunamadı.");
    }

    branch.name = name;
    branch.address = address;
    branch.phoneNumber = phoneNumber;
    branch.workingHours = workingHours;

    const updatedRestaurant = await restaurant.save();
    customLog(`The restaurant named ${req.user.name} edited a branch.`);
    res.status(201).json(updatedRestaurant);
  } else {
    res.status(404);
    throw new Error("Restorant bulunamadı.");
  }
});

const restaurantController = {
  getAllRestaurants,
  getRestaurant,
  sendRestaurantReview,
  createBranch,
  getBranches,
  deleteBranch,
  getBranch,
  editBranch,
};
export default restaurantController;
