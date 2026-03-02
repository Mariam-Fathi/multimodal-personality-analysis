const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");
const directoryPath = path.dirname(require.main.filename);

const getMyInfo = async (req, res) => {
    try {
        const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY);
        req.currentUser = payload;

        res.status(200).json({
            _id: payload._id,
            email: payload.email,
            age: payload.age,
            major: payload.major,
            role: payload.role,
        });
    } catch (error) {
        res.status(401).json({ status: "failed", message: "Invalid or expired session." });
    }
};

const uploadVideo = async (req, res) => {
    let responseSent = false;
    const sendOnce = (statusCode, body) => {
        if (responseSent) return;
        responseSent = true;
        res.status(statusCode).json(body);
    };

    try {
        const files = req.files;
        if (!files || Object.keys(files).length === 0) {
            return sendOnce(400, { status: "error", message: "No files uploaded" });
        }

        const fileKeys = Object.keys(files);
        const videosDir = path.join(directoryPath, "videos");
        await fs.promises.mkdir(videosDir, { recursive: true });
        let videoPath = "";

        for (const key of fileKeys) {
            const file = Array.isArray(files[key]) ? files[key][0] : files[key];
            const destPath = path.join(videosDir, file.name);
            videoPath = path.join(directoryPath, "videos", file.name);

            await new Promise((resolve, reject) => {
                file.mv(destPath, (err) => (err ? reject(err) : resolve()));
            });
        }

        console.log(`${fileKeys.toString()} uploaded successfully`);

        const scriptPath = path.join(directoryPath, "ML", "Traits-Prediction.py");
        const pythonCmd = process.env.PYTHON_PATH || "python";

        const pythonProcess = spawn(pythonCmd, [scriptPath, directoryPath, videoPath], {
            cwd: directoryPath,
        });

        let pythonOutput = "";
        pythonProcess.stdout.on("data", (data) => {
            pythonOutput += data.toString();
            console.log(data.toString());
        });

        pythonProcess.stderr.on("data", (data) => {
            console.error(data.toString());
        });

        pythonProcess.on("error", (err) => {
            console.error("Failed to start Python:", err);
            sendOnce(500, {
                status: "error",
                message: "Python is not available or ML script not found. Check PYTHON_PATH and ML/Traits-Prediction.py.",
            });
        });

        pythonProcess.on("close", (code) => {
            if (responseSent) return;
            if (code !== 0) {
                sendOnce(500, {
                    status: "error",
                    message: "Personality prediction script failed.",
                });
                return;
            }

            const regex = /(\w+)\sValue:\s(\d+\.?\d*)/g;
            const matches = pythonOutput.matchAll(regex);
            const values = {};
            for (const match of matches) {
                const [, trait, value] = match;
                values[trait.toLowerCase()] = parseFloat(value);
            }

            const defaults = {
                extraversion: 0,
                agreeableness: 0,
                conscientiousness: 0,
                neuroticism: 0,
                openness: 0,
            };
            sendOnce(200, {
                ...defaults,
                ...values,
                status: "success",
            });
        });
    } catch (error) {
        console.error("Error:", error);
        if (!responseSent) {
            res.status(500).json({ status: "error", message: error.message || error.toString() });
        }
    }
};

module.exports = { getMyInfo, uploadVideo };
