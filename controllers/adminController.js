const { User } = require("../models/user");
const dotenv = require("dotenv");

dotenv.config();

const getAllApplicants = async (req, res) => {
    try {
        const applicants = await User.find({ role: "applicant" });

        if (!applicants.length) {
            return res.status(400).json({
                status: "failed",
                message: "No existing applicants to be shown!",
            });
        }

        res.status(200).json(applicants);
    } catch (error) {
        res.status(400).json({ status: "failed", error });
    }
};

const getApplicant = async (req, res) => {
    try {
        const applicant = await User.findById(req.params.id);
        if (!applicant) {
            return res.status(400).json({
                status: "failed",
                message: "No existing applicant with the given ID!",
            });
        }
        res.status(200).json(applicant);
    } catch (error) {
        res.status(400).json({
            status: "failed",
            message: "No existing applicant with the given ID!",
        });
    }
};

const deleteAllApplicants = async (req, res) => {
    try {
        const result = await User.deleteMany({ role: "applicant" });

        if (!result.deletedCount) {
            return res.status(400).json({
                status: "failed",
                message: "No existing applicants to be deleted!",
            });
        }

        const message =
            result.deletedCount === 1
                ? "Only one applicant deleted successfully."
                : `${result.deletedCount} applicants deleted successfully.`;

        res.status(200).json({ status: "success", message });
    } catch (error) {
        res.status(400).json({ status: "failed", error });
    }
};

const deleteApplicant = async (req, res) => {
    try {
        const applicant = await User.findById(req.params.id);

        if (!applicant) {
            return res.status(400).json({
                status: "failed",
                message: "Invalid ID!",
            });
        }

        if (applicant.role === "admin") {
            return res.status(400).json({
                status: "failed",
                message: "Cannot delete an admin!",
            });
        }

        await User.deleteOne({ _id: applicant._id });

        res.status(200).json({
            status: "success",
            message: `${applicant.name} was deleted successfully.`,
        });
    } catch (error) {
        res.status(400).json({
            status: "failed",
            message: "Invalid ID!",
        });
    }
};

module.exports = {
    getAllApplicants,
    getApplicant,
    deleteApplicant,
    deleteAllApplicants,
};
