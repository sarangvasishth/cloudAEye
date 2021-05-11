const express = require("express");
const router = express.Router();

const { signUp, login, isEmailExists } = require("../controllers/auth");

router.post("/login", login);
router.post("/sign-up", signUp);
router.post("/is-email-exist", isEmailExists);

module.exports = router;
