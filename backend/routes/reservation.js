import express from "express";
import reservationController from "../controllers/reservation.js";
import { isAuth, isRestaurant } from "../middleware/authHandler.js";
const router = express.Router();

router.post("/makeReservation", isAuth, reservationController.makeReservation);
router.get(
  "/myReservations",
  isAuth,
  reservationController.getUserReservations
);
router.get(
  "/getRestaurantReservations",
  isRestaurant,
  reservationController.getAllReservations
);
router.put(
  "/:id/approve",
  isRestaurant,
  reservationController.approveReservation
);
router.put(
  "/:id/decline",
  isRestaurant,
  reservationController.declineReservation
);

export default router;
