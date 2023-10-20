import express from "express";
import userController from "../controllers/user.js";
import { isAuth, isRestaurant } from "../middleware/authHandler.js";

const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", isAuth, userController.logout);
router
  .route("/profile")
  .put(isAuth, userController.updateProfile)
  .post(isRestaurant, userController.updateProfile);

export default router;
