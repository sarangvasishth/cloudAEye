const slugify = require("slugify");
const mongoose = require("mongoose");

const ClusterRequest = require("../models/clusterRequest");

const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");

const { REQUEST_STATUS, DEFAULT_ITEMS_PER_PAGE } = require("../src/constants");

exports.createClusterRequest = asyncHandler(async (req, res, next) => {
  const { name, nodes, nodeType } = req.body;

  if (!name) {
    return next(new ErrorResponse("Cluster name is required.", 400));
  }
  if (!nodes) {
    return next(new ErrorResponse("Number of nodes are required.", 400));
  }
  if (!nodeType) {
    return next(new ErrorResponse("Node type is required", 400));
  }

  const clusterRequest = new ClusterRequest({
    _id: new mongoose.Types.ObjectId(),
    name,
    nodes,
    status: "PENDING",
    nodeType,
    createdBy: req.user._id,
  });

  await clusterRequest.save();

  return res.status(200).json({
    success: true,
    data: { clusterRequest },
    message: "Cluster request successfully created.",
  });
});

exports.getClusterRequests = asyncHandler(async (req, res, next) => {
  const { user } = req;

  let { page, search, status } = req.query;

  if (!page) page = 1;

  let conditions = [{ status: status ? status : "PENDING" }];
  if (user.role === "DEVELOPMENT") {
    conditions.push({ createdBy: user._id });
  }
  if (search) {
    conditions.push({ name: { $regex: search, $options: "i" } });
  }
  const pipeLine = [
    { $match: { $and: conditions } },
    { $sort: { createdAt: -1 } },
    { $skip: DEFAULT_ITEMS_PER_PAGE * page - DEFAULT_ITEMS_PER_PAGE },
    { $limit: DEFAULT_ITEMS_PER_PAGE },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "CreatedByDetails",
      },
    },
    {
      $unwind: {
        path: "$CreatedByDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        name: 1,
        nodes: 1,
        status: 1,
        nodeType: 1,
        createdAt: 1,
        createdBy: "$CreatedByDetails.email",
      },
    },
  ];

  const totalCount = await ClusterRequest.countDocuments({ $and: conditions });
  const requests = await ClusterRequest.aggregate(pipeLine);

  return res.status(200).json({
    success: true,
    data: { requests, totalCount },
  });
});

exports.isClusterNameExists = asyncHandler(async (req, res, next) => {
  ClusterRequest.find(
    {
      slug: req.body.name ? slugify(req.body.name, { lower: true }) : null,
    },
    (err, requests) => {
      if (err) {
        return res.status(200).json({ success: false, data: null });
      }
      if (requests.length > 0) {
        return res.status(200).json({ success: true, data: { exists: true } });
      } else {
        return res.status(200).json({ success: true, data: { exists: false } });
      }
    }
  );
});

exports.approveClusterRequest = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new ErrorResponse("Cluster detail is missing.", 400));
  }

  const cluster = await ClusterRequest.findById({ _id: id });
  if (!cluster) {
    return next(new ErrorResponse(`Cluster not found.`, 400));
  }

  const updated = await ClusterRequest.findByIdAndUpdate(
    { _id: id },
    { status: REQUEST_STATUS.APPROVED },
    { upsert: true }
  );
  return res.status(200).json({
    success: true,
    data: { cluster: updated },
    message: "Request successfully approved.",
  });
});
exports.denyClusterRequest = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new ErrorResponse("Cluster detail is missing.", 400));
  }

  const cluster = await ClusterRequest.findById({ _id: id });
  if (!cluster) {
    return next(new ErrorResponse(`Cluster not found.`, 400));
  }

  const updated = await ClusterRequest.findByIdAndUpdate(
    { _id: id },
    { status: REQUEST_STATUS.DENIED },
    { upsert: true }
  );
  return res.status(200).json({
    success: true,
    data: { cluster: updated },
    message: "Request successfully denied.",
  });
});
