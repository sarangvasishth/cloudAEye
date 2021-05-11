const jwt = require("jsonwebtoken");

const tokenForUser = (user) => {
  return jwt.sign(
    {
      role: user.role,
      userId: user.userId,
    },
    process.env.PASSPORT_SECRECT,
    { expiresIn: "30d" }
  );
};

module.exports = { tokenForUser };
