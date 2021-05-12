require("colors");
require("dotenv").config();

const express = require("express");
const logger = require("morgan");

const cors = require("cors");
const bodyParser = require("body-parser");

const hpp = require("hpp");
const xss = require("xss-clean");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");

const connectDB = require("./config/db");
const errorHandler = require("./middlewares/error");
const ErrorResponse = require("./utils/errorResponse");

const { DEVELOPMENT } = require("./src/constants");

connectDB();
const app = express();

// dev logging middleware
if (process.env.NODE_ENV === DEVELOPMENT) {
  app.use(logger("dev"));
}

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// api security measures
app.use(hpp());
app.use(xss());
app.use(helmet());
app.use(limiter);
app.use(mongoSanitize());

app.use(cors());
app.use(bodyParser());

app.use("/api/v1/auth", require("./routes/auth"));
app.use("/api/v1/cluster", require("./routes/cluster"));

app.use(function (req, res, next) {
  res.status(404);
  res.send("404: Not Found!");
});

app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`App listening at Port: ${PORT}`.yellow.bold);
});

// Handle unhandled promise rejection
process.on("unhandledRejection", (error) => {
  console.log(`Error: ${error.message}`.red.bold);
});
