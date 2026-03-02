const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");

dotenv.config();

const signUp = async (req, res) => {
    const email = (req.body.email || "").trim().toLowerCase();
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return res.status(400).json({
            status: "failed",
            message: "This email is already registered.",
        });
    }

    // Only allow these fields; never trust role from client
    const { name, password, gender, age, major } = req.body;
    const userData = {
        name: name?.trim(),
        email,
        password: password?.trim(),
        gender: gender?.trim() || undefined,
        age: age != null && age !== "" ? Number(age) : undefined,
        major: major?.trim() || undefined,
    };

    try {
        await User.create(userData);
        console.log("User created:", email);
        res.status(201).json({
            status: "success",
            message: "Account created. You can sign in now.",
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            const msg = Object.values(error.errors).map((e) => e.message).join("; ");
            return res.status(400).json({ status: "failed", message: msg || "Validation failed." });
        }
        res.status(500).json({ status: "failed", message: "Registration failed. Please try again." });
    }
};

const signIn = async (req, res) => {
    const email = (req.body.email || "").trim().toLowerCase();
    const user = await User.findOne({ email });

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

    if (!process.env.JWT_KEY) {
        return res.status(500).json({
            status: "failed",
            message: "Server configuration error.",
        });
    }

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

    req.session = { jwt: userJwt };

    res.status(200).json({
        status: "success",
        message: "Signed in Successfully",
        role: user.role,
    });
};

const signOut = async (req, res) => {
    req.session = null;
    res.status(200).json({ status: "success", message: "Signed out successfully" });
};

module.exports = { signUp, signIn, signOut };
