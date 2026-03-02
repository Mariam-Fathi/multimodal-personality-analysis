const express = require("express");
const path = require("path");
const adminRouter = express.Router();

const { isAuthorizedUser } = require("../middlewares/checkRole");
const currentUser = require("../middlewares/current-user");
const requireAuth = require("../middlewares/require-auth");

const {
    getAllApplicants,
    getApplicant,
    deleteAllApplicants,
    deleteApplicant,
} = require("../controllers/adminController");

const staticPath = path.join(path.dirname(require.main.filename), "statics");
adminRouter.use(express.static(staticPath));

const sendAdministration = (req, res) =>
    res.sendFile(path.join(__dirname, "../views/administration.html"));
adminRouter.get("/administration", sendAdministration);
adminRouter.get("/administration/", sendAdministration);

const authMiddleware = [currentUser, requireAuth, isAuthorizedUser()];

adminRouter.get("/applicants", ...authMiddleware, getAllApplicants);
adminRouter.get("/applicant/:id", ...authMiddleware, getApplicant);
adminRouter.delete("/applicants", ...authMiddleware, deleteAllApplicants);
adminRouter.delete("/applicant/:id", ...authMiddleware, deleteApplicant);

module.exports = { adminRouter };