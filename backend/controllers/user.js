import path from "path";
import fs from "fs";
import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/user.js";
import generateToken from "../utils/generateToken.js";
import Restaurant from "../models/restaurant.js";
import customLog from "../utils/log.js";
import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID,
  region: "eu-north-1",
});
const ses = new AWS.SES();

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
      var params = {
        EmailAddress: email,
        // TemplateName: "Registration_Email_For_User",
      };

      // Request production access yapılması gerekiyor. Bundan dolayı kullanamıyorum.
      // ses.sendCustomVerificationEmail(params, function (err, data) {
      //   if (err) console.log(err);
      //   else console.log(data);
      // });

      ses.verifyEmailIdentity(params, function (err, data) {
        if (err) console.log(err);
      });

      customLog(`The user named ${name} registered to the system.`);

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
      var params = {
        EmailAddress: email,
        // TemplateName: "Registration_Email_For_Restaurant",
      };

      // Request production access yapılması gerekiyor. Bundan dolayı kullanamıyorum.
      // ses.sendCustomVerificationEmail(params, function (err, data) {
      //   if (err) console.log(err);
      //   else console.log(data);
      // });

      ses.verifyEmailIdentity(params, function (err, data) {
        if (err) console.log(err);
      });

      customLog(`The restaurant named ${name} registered to the system.`);
      res.status(201).json({
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
      res.status(400);
      throw new Error("Kayıt gerçekleştirilemedi.");
    }
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password, type } = req.body;

  const emailVerified = await checkEmail({ email: email });

  if (!emailVerified) {
    res.status(400);
    throw new Error(
      "Lütfen E-Postanıza gönderilen linke tıklayıp. Hesabınızı aktifleştiriniz."
    );
  }

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

const logout = (req, res) => {
  res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: "Çıkış yapıldı." });
};

const updateProfile = asyncHandler(async (req, res) => {
  const { type } = req.body;

  if (type === "user") {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error("Kullanıcı bulunamadı.");
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    customLog(`The user named ${updatedUser.name} updated his/her profile.`);
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
    });
  } else if (type === "restaurant") {
    const restaurant = await Restaurant.findById(req.user._id);

    if (!restaurant) {
      res.status(404);
      throw new Error("Restorant bulunamadı.");
    }

    restaurant.name = req.body.name || restaurant.name;
    restaurant.email = req.body.email || restaurant.email;

    if (
      req.body.image !== restaurant.image &&
      restaurant.image !== "/uploads/sample.jpg"
    ) {
      clearImage(restaurant.image);
    }
    restaurant.image = req.body.image;

    if (req.body.password) {
      restaurant.password = req.body.password;
    }

    const updatedRestaurant = await restaurant.save();
    customLog(
      `The restaurant named ${updatedRestaurant.name} updated its profile.`
    );
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
  }
});

const clearImage = (filePath) => {
  const __dirname = path.resolve();
  filePath = path.join(__dirname, filePath);
  fs.unlink(filePath, (err) => console.log(err));
};

const checkEmail = ({ email }) =>
  new Promise((resolve, reject) => {
    ses.getIdentityVerificationAttributes(
      {
        Identities: [email],
      },
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          const status =
            data?.VerificationAttributes[email]?.VerificationStatus;
          resolve(status === "Success");
        }
      }
    );
  });

const userController = {
  register,
  login,
  logout,
  updateProfile,
};

export default userController;
