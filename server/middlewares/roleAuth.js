const ErrorResponse = require("../utils/errorResponse");

const authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          400
        )
      );
    }
    next();
  };
};
module.exports = authorize;
