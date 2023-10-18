import express from "express";
import userController from "../controllers/user.js";
import { isAuth } from "../middleware/authHandler.js";

const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", isAuth, userController.logout);
router
  .route("/profile")
  .get(isAuth, userController.getProfile)
  .put(isAuth, userController.updateProfile);

export default router;
