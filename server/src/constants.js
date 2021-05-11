const SALT_ROUNDS = 10;
const DEVELOPMENT = "development";
const DEFAULT_ITEMS_PER_PAGE = 10;

const ROLES = {
  DEVOPS: "DEVOPS",
  DEVELOPMENT: "DEVELOPMENT",
};

const REQUEST_STATUS = {
  DENIED: "DENIED",
  PENDING: "PENDING",
  APPROVED: "APPROVED",
};

module.exports = {
  ROLES,
  SALT_ROUNDS,
  DEVELOPMENT,
  REQUEST_STATUS,
  DEFAULT_ITEMS_PER_PAGE,
};
