import asyncHandler from "../middleware/asyncHandler.js";
import Reservation from "../models/reservation.js";
import Restaurant from "../models/restaurant.js";

const makeReservation = asyncHandler(async (req, res) => {
  const { userName, userEmail, userPhone, restaurantId, branch, date, time } =
    req.body;

  if (
    !userName ||
    !userEmail ||
    !userPhone ||
    !restaurantId ||
    !branch ||
    !date ||
    !time
  ) {
    res.status(400);
    throw new Error("Lütfen tüm kutucukları doldurunuz.");
  }

  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    res.status(404);
    throw new Error("Böyle bir restorant bulunamadı.");
  }

  const branchObject = restaurant.branches.find((b) => b.name === branch);
  if (!branchObject) {
    res.status(404);
    throw new Error("Böyle bir şube bulunamadı.");
  }

  const reservation = new Reservation({
    user: req.user._id,
    restaurant: restaurantId,
    branch: branchObject._id,
    reservationDate: date,
    reservationTime: time,
    note: req.body.note ? req.body.note : "",
  });

  const createdReservation = await reservation.save();
  res.status(201).json(createdReservation);
});

const getUserReservations = asyncHandler(async (req, res) => {
  const reservations = await Reservation.find({ user: req.user._id });
  res.status(200).json(reservations);
});

const reservationController = { makeReservation, getUserReservations };

export default reservationController;
