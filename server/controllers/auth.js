const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const User = require("../models/user");

const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");

const { tokenForUser } = require("../utils/helpers");

const { SALT_ROUNDS } = require("../src/constants");

exports.signUp = asyncHandler(async (req, res, next) => {
  const { email, password, role } = req.body;

  if (!email) {
    return next(new ErrorResponse("Email is missing.", 400));
  }
  if (!password) {
    return next(new ErrorResponse("Password is missing.", 400));
  }
  if (!role) {
    return next(new ErrorResponse("User role is missing.", 400));
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    email,
    role,
    password: hashedPassword,
  });

  await user.save();
  return res
    .status(200)
    .json({ success: true, data: {}, message: "User successfully created." });
});

// user login api, returns token
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email) {
    return next(new ErrorResponse("Email is missing.", 400));
  }
  if (!password) {
    return next(new ErrorResponse("Password is missing.", 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(
      new ErrorResponse(
        `Unauthorised user ${req.body.email} tried to logged in.`,
        400
      )
    );
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return next(new ErrorResponse("Wrong password!", 400));
  }

  const token = tokenForUser({
    userId: user._id,
    role: user.role,
  });
  res.status(200).json({ success: true, data: { token, role: user.role } });
});

exports.isEmailExists = asyncHandler(async (req, res, next) => {
  User.find({ email: req.body.email }, (err, users) => {
    if (err) {
      return res.status(200).json({ success: false, data: null });
    }
    if (users.length > 0) {
      return res.status(200).json({ success: true, data: { exists: true } });
    } else {
      return res.status(200).json({ success: true, data: { exists: false } });
    }
  });
});
