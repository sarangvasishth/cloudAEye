const slugify = require("slugify");

const mongoose = require("mongoose");
const schema = mongoose.Schema;

const ErrorResponse = require("../utils/errorResponse");

const clusterRequestModel = new schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    slug: {
      type: String,
      unique: [true, "Name already exists."],
    },
    nodes: {
      type: Number,
      required: true,
    },
    nodeType: {
      type: String,
      required: true,
      enum: ["t3.micro", "t3.small", "t3.medium"],
    },
    status: {
      type: String,
      required: true,
      enum: ["PENDING", "APPROVED", "DENIED"],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

clusterRequestModel.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

clusterRequestModel.post("save", function (error, doc, next) {
  if (error.name === "MongoError" && error.code === 11000) {
    next(
      new ErrorResponse(
        "Cluster request with given cluster name already exists.",
        400
      )
    );
  } else {
    next();
  }
});

module.exports = mongoose.model("clusterRequest", clusterRequestModel);
