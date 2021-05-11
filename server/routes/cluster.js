const express = require("express");
const router = express.Router();

const passport = require("passport");
const requireAuth = passport.authenticate("jwt", { session: false });

const authorize = require("../middlewares/roleAuth");

const { ROLES } = require("../src/constants");

require("../services/passport");

const {
  denyClusterRequest,
  getClusterRequests,
  isClusterNameExists,
  createClusterRequest,
  approveClusterRequest,
} = require("../controllers/cluster");

router.route("/is-cluster-name-exists").post(isClusterNameExists);

router.route("/cluster-request").post(requireAuth, createClusterRequest);
router.route("/cluster-request-active").get(requireAuth, getClusterRequests);

router
  .route("/deny-cluster-request/:id")
  .get(requireAuth, authorize([ROLES.DEVOPS]), denyClusterRequest);
router
  .route("/approve-cluster-request/:id")
  .get(requireAuth, authorize([ROLES.DEVOPS]), approveClusterRequest);

module.exports = router;
