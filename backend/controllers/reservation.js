import SES from "aws-sdk/clients/ses.js";
import emailTemplate from "../utils/email.js";
import asyncHandler from "../middleware/asyncHandler.js";
import Reservation from "../models/reservation.js";
import Restaurant from "../models/restaurant.js";
import customLog from "../utils/log.js";

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

  const isInRange = checkTimeRange(time, branchObject.workingHours);
  if (!isInRange) {
    res.status(404);
    throw new Error("Lütfen çalışma saatlerine uygun bir saat seçiniz.");
  }

  const reservation = new Reservation({
    user: req.user._id,
    restaurant: restaurantId,
    branch: branchObject.name,
    reservationDate: date,
    reservationTime: time,
    note: req.body.note ? req.body.note : "",
  });

  const createdReservation = await reservation.save();

  if (createdReservation) {
    const awsConfig = {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID,
      region: "eu-north-1",
      apiVersion: "2010-12-01",
    };

    const awsSes = new SES(awsConfig);

    awsSes.sendEmail(
      emailTemplate(
        restaurant.email,
        `<p>The user named ${userName} sent a reservation request to yout branch named ${branch} on ${date} at ${time}.</p>`,
        process.env.RESERVE_SEAT_EMAIL,
        `Reservation Request`
      ),
      (err, data) => {
        if (err) {
          res.status(400);
          throw new Error("E-posta gönderilemedi.");
        } else {
          customLog(
            `The user named ${req.user.name} made a reservation to the restaurant named ${restaurant.name}.`
          );
          res.status(201).json(createdReservation);
        }
      }
    );
  } else {
    res.status(400);
    throw new Error("Rezervasyon isteği gönderilemedi.");
  }
});

const getUserReservations = asyncHandler(async (req, res) => {
  const reservations = await Reservation.find({ user: req.user._id }).populate(
    "restaurant",
    "name"
  );
  res.status(200).json(reservations);
});

const getAllReservations = asyncHandler(async (req, res) => {
  const perPage = 1;
  const pageNumber = Number(req.query.pageNumber) || 1;
  let searchObj = { restaurant: req.user._id };

  if (req.query.keyword) {
    searchObj = {
      restaurant: req.user._id,
      branch: req.query.keyword,
    };
  } else if (req.query.date) {
    searchObj = { restaurant: req.user._id, reservationDate: req.query.date };
  }

  if (req.query.keyword && req.query.date) {
    searchObj = {
      restaurant: req.user._id,
      branch: req.query.keyword,
      reservationDate: req.query.date,
    };
  }
  const totalRezNumber = await Reservation.find({
    restaurant: req.user._id,
  }).countDocuments(searchObj);

  const reservations = await Reservation.find(searchObj)
    .skip((pageNumber - 1) * perPage)
    .limit(perPage)
    .populate("user", "name");

  res.status(200).json({
    reservations,
    page: pageNumber,
    numberOfPage: Math.ceil(totalRezNumber / perPage),
  });
});

const approveReservation = asyncHandler(async (req, res) => {
  const reservationId = req.params.id;
  const reservation = await Reservation.findById(reservationId).populate(
    "user",
    "name email"
  );
  if (!reservation) {
    res.status(404);
    throw new Error("Böyle bir rezervasyon bulunamadı.");
  }
  reservation.isApproved = "Approved";
  const updatedReservation = await reservation.save();
  if (updatedReservation) {
    const awsConfig = {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID,
      region: "eu-north-1",
      apiVersion: "2010-12-01",
    };

    const awsSes = new SES(awsConfig);

    awsSes.sendEmail(
      emailTemplate(
        reservation.user.email,
        `<p>Dear customer ${
          reservation.user.name
        }, your reservation has been confirmed. See you at our ${
          reservation.branch
        } branch on ${reservation.reservationDate
          .toString()
          .substring(0, 15)} at ${reservation.reservationTime}.</p>`,
        req.user.email,
        `Reservation Response`
      ),
      (err, data) => {
        if (err) {
          res.status(400);
          throw new Error("E-posta gönderilemedi.");
        } else {
          customLog(
            `The restaurant named ${req.user.name} approved the reservation of the user named ${reservation.user.name}.`
          );
          res.status(201).json(updatedReservation);
        }
      }
    );
  } else {
    res.status(404);
    throw new Error("Rezervasyon reddedilemedi.");
  }
});

const declineReservation = asyncHandler(async (req, res) => {
  const reservationId = req.params.id;
  const reservation = await Reservation.findById(reservationId).populate(
    "user",
    "name email"
  );
  if (!reservation) {
    res.status(404);
    throw new Error("Böyle bir rezervasyon bulunamadı.");
  }
  reservation.isApproved = "Declined";
  const updatedReservation = await reservation.save();

  if (updatedReservation) {
    const awsConfig = {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID,
      region: "eu-north-1",
      apiVersion: "2010-12-01",
    };

    const awsSes = new SES(awsConfig);

    awsSes.sendEmail(
      emailTemplate(
        reservation.user.email,
        `<p>Dear customer ${reservation.user.name}, unfortunately we cannot confirm your reservation.</p>`,
        req.user.email,
        `Reservation Response`
      ),
      (err, data) => {
        if (err) {
          res.status(400);
          throw new Error("E-posta gönderilemedi.");
        } else {
          customLog(
            `The restaurant named ${req.user.name} declined the reservation of the user named ${reservation.user.name}.`
          );
          res.status(201).json(updatedReservation);
        }
      }
    );
  } else {
    res.status(404);
    throw new Error("Rezervasyon reddedilemedi.");
  }
});

const checkTimeRange = (time, workingHours) => {
  const timeParts = workingHours.split("-");
  if (timeParts[1] === "00:00") {
    timeParts[1] = "24:00";
  }

  if (time > timeParts[0] && time < timeParts[1]) {
    return true;
  } else {
    return false;
  }
};

const reservationController = {
  makeReservation,
  getUserReservations,
  getAllReservations,
  approveReservation,
  declineReservation,
};

export default reservationController;
