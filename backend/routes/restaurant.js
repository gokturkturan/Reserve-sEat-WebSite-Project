import express from "express";
import restaurantController from "../controllers/restaurant.js";
import { isAuth, isRestaurant } from "../middleware/authHandler.js";
import { checkObjectId } from "../middleware/checkObjectId.js";

const router = express.Router();

router.get("/getBranches", isRestaurant, restaurantController.getBranches);
router.delete(
  "/deleteBranch/:id",
  isRestaurant,
  restaurantController.deleteBranch
);
router.get("/", restaurantController.getAllRestaurants);
router.route("/:id").get(checkObjectId, restaurantController.getRestaurant);
router
  .route("/:id/reviews")
  .post(isAuth, checkObjectId, restaurantController.sendRestaurantReview);
router.post("/createBranch", isRestaurant, restaurantController.createBranch);
router.get("/branch/:id", isRestaurant, restaurantController.getBranch);
router.put("/branch/:id", isRestaurant, restaurantController.editBranch);

export default router;
