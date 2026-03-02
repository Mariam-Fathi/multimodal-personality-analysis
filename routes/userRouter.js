const express = require("express");
const { body } = require("express-validator");
const path = require("path");

const { signUp, signIn, signOut } = require("../controllers/userController");
const { isAuthorizedUser } = require("../middlewares/checkRole");
const currentUser = require("../middlewares/current-user");
const validateRequest = require("../middlewares/validate-request");

const userRouter = express.Router();

const staticPath = path.join(path.dirname(require.main.filename), "statics");
userRouter.use(express.static(staticPath));

userRouter.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/home.html"));
});

userRouter.get("/registration", (req, res) => res.redirect(302, "/sfe-rs/registration/"));
userRouter.get("/registration/", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/registration.html"));
});

userRouter.post(
    "/registration/signup/",
    [
        body("name")
            .notEmpty()
            .isString()
            .matches(/^[a-zA-Z\s]+$/)
            .withMessage("Insert your name!"),

        body("email")
            .notEmpty()
            .withMessage("Email is required!")
            .isEmail()
            .withMessage("Email must be valid!"),

        body("password")
            .notEmpty()
            .withMessage("Password is required!")
            .trim()
            .matches(/[a-zA-Z]/)
            .withMessage("Password must contain at least one letter!")
            .isLength({ min: 5, max: 20 })
            .withMessage("Password must be between 5 and 20 characters!"),
    ],
    validateRequest,
    signUp
);

userRouter.post(
    "/registration/signin/",
    [
        body("email")
            .notEmpty()
            .withMessage("E-Mail is required!")
            .isEmail()
            .withMessage("Invalid email!"),

        body("password")
            .trim()
            .notEmpty()
            .withMessage("Password is required")
            .isLength({ min: 5, max: 20 })
            .withMessage("Password must have in range (5 : 20) characters"),
    ],
    validateRequest,
    signIn
);

userRouter.post("/signout/", signOut);

module.exports = { userRouter };