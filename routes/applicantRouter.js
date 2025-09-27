const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");

const currentUser = require("../middlewares/current-user");
const requireAuth = require("../middlewares/require-auth");
const filesPayloadExists = require("../middlewares/filesPayloadExists");
const fileExtLimiter = require("../middlewares/fileExtLimiter");
const fileSizeLimiter = require("../middlewares/fileSizeLimiter");
const { getMyInfo, uploadVideo } = require("../controllers/applicantController");

const applicantRouter = express.Router();

const staticPath = path.join(path.dirname(require.main.filename), "statics");
applicantRouter.use(express.static(staticPath));

applicantRouter.get("/upload-video/", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/uploadVideo.html"));
});

applicantRouter.get("/waiting/", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/waiting.html"));
});

applicantRouter.get("/personality-analysis/", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/analysis.html"));
});

applicantRouter.get("/get-my-info", currentUser, requireAuth, getMyInfo);

applicantRouter.post(
    "/upload-video",
    fileUpload({ createParentPath: true }),
    filesPayloadExists,
    fileExtLimiter([".mp4", ".mov", ".wmv"]),
    fileSizeLimiter,
    uploadVideo
);

module.exports = { applicantRouter };