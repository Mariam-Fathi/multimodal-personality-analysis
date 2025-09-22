const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const path = require("path");
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
        res.status(400).json({ status: "failed", error });
    }
};

const uploadVideo = async (req, res) => {
    try {
        const files = req.files;
        if (!files || Object.keys(files).length === 0) {
            return res.status(400).json({ status: "error", message: "No files uploaded" });
        }

        // Move files to videos folder
        const fileKeys = Object.keys(files);
        let videoPath = "";
        for (const key of fileKeys) {
            const filepath = path.join(__dirname, "../videos", files[key].name);
            videoPath = path.join(directoryPath, "videos", files[key].name);

            await new Promise((resolve, reject) => {
                files[key].mv(filepath, (err) => (err ? reject(err) : resolve()));
            });
        }

        console.log(`${fileKeys.toString()} Uploaded Successfully`);

        // Spawn Python script
        const pythonProcess = spawn("python", [
            path.join(directoryPath, "ML", "Traits-Prediction.py"),
            directoryPath,
            videoPath,
        ]);

        let pythonOutput = "";
        pythonProcess.stdout.on("data", (data) => {
            pythonOutput += data.toString();
            console.log(data.toString());
        });

        pythonProcess.on("close", (code) => {
            if (code !== 0) {
                console.error("Python script execution failed!");
                return res.status(500).json({
                    status: "error",
                    message: "Python script execution failed!",
                });
            }

            const regex = /(\w+)\sValue:\s(\d+\.?\d*)/g;
            const matches = pythonOutput.matchAll(regex);
            const values = {};
            for (const match of matches) {
                const [, trait, value] = match;
                values[trait.toLowerCase()] = parseFloat(value);
            }

            res.json({
                extraversion: values.extraversion,
                agreeableness: values.agreeableness,
                conscientiousness: values.conscientiousness,
                neuroticism: values.neuroticism,
                openness: values.openness,
                status: "success",
            });
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ status: "error", message: error.toString() });
    }
};

module.exports = { getMyInfo, uploadVideo };
