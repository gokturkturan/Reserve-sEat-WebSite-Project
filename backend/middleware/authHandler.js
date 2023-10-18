import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import User from "../models/user.js";
import Restaurant from "../models/restaurant.js";

const isAuth = asyncHandler(async (req, res, next) => {
  let token = req.cookies.jwt;
  if (token) {
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decodedToken.userId).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authenticated. Token Failed.");
    }
  } else {
    res.status(401);
    throw new Error("Not authenticated.");
  }
});

const isRestaurant = asyncHandler(async (req, res, next) => {
  let token = req.cookies.jwt;
  if (token) {
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await Restaurant.findById(decodedToken.userId).select(
        "-password"
      );
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authenticated. Token Failed.");
    }
  } else {
    res.status(401);
    throw new Error("Not authenticated.");
  }
});

export { isAuth, isRestaurant };
