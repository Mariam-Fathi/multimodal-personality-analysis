require("dotenv").config();
const express = require("express");
require("express-async-errors");

const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");

const errorHandler = require("./middlewares/error-handler");
const NotFoundError = require("./errors/not-found-error");

const app = express();
const path = require("path");

app.use(express.json());

app.use(cookieParser());
app.use(
  cookieSession({
    name: "sessionIdCookie",
    secret: process.env.SESSION_SECRET || "dev-secret-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    },
  })
);

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

const { userRouter } = require("./routes/userRouter");
const { adminRouter } = require("./routes/adminRouter");
const { applicantRouter } = require("./routes/applicantRouter");

app.use("/sfe-rs/", userRouter);
app.use("/sfe-rs/admin/", adminRouter);
app.use("/sfe-rs/applicant/", applicantRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

module.exports = {
  app,
};
