const mongoose = require("mongoose");
const schema = mongoose.Schema;

const ErrorResponse = require("../utils/errorResponse");

const userModel = new schema(
  {
    email: {
      type: String,
      required: true,
      unique: [true, "Email already exists."],
      trim: true,
      minlength: 2,
      maxlength: 140,
    },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["DEVELOPMENT", "DEVOPS"],
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

userModel.index({ email: "text" });

userModel.post("save", function (error, doc, next) {
  if (error.name === "MongoError" && error.code === 11000) {
    next(new ErrorResponse("An account with this Email already exist.", 400));
  } else {
    next();
  }
});

module.exports = mongoose.model("user", userModel);
