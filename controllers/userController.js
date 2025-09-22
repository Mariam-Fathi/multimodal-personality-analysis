const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");

dotenv.config();

const signUp = async (req, res) => {
    try {
        const existingEmail = await User.findOne({ email: req.body.email });

        if (existingEmail) {
            return res.status(400).json({
                status: "failed",
                message: "This email is reserved!",
            });
        }

        await User.create(req.body);
        console.log("User created.");

        res.status(200).json({
            status: "success",
            message: "User created.",
        });
    } catch (error) {
        res.status(500).json({ status: "failed", message: error.toString() });
    }
};

const signIn = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(400).json({
                status: "failed",
                message: "Invalid email!",
            });
        }

        const matchedPassword = await bcrypt.compare(req.body.password, user.password);

        if (!matchedPassword) {
            return res.status(400).json({
                status: "failed",
                message: "Invalid Password!",
            });
        }

        console.log(`${user.name} signed in`);

        // Generate JWT
        const userJwt = jwt.sign(
            {
                _id: user._id,
                email: user.email,
                age: user.age,
                major: user.major,
                role: user.role,
            },
            process.env.JWT_KEY
        );

        // Store it on session object
        req.session = { jwt: userJwt };

        res.status(200).json({
            status: "success",
            message: "Signed in Successfully",
            role: user.role,
        });
    } catch (error) {
        res.status(500).json({ status: "failed", message: error.toString() });
    }
};

const signOut = async (req, res) => {
    req.session = null;
    res.status(200).json({ status: "success", message: "Signed out successfully" });
};

module.exports = { signUp, signIn, signOut };
