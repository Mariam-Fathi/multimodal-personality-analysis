const { User } = require("../models/user");

// Constants
const APPLICANT_ROLE = "applicant";
const ADMIN_ROLE = "admin";

const handleError = (res, error, customMessage = "An error occurred") => {
    console.error(error);
    res.status(400).json({
        status: "failed",
        message: customMessage,
    });
};

const getAllApplicants = async (req, res) => {
    try {
        const existingApplicants = await User.find({ role: APPLICANT_ROLE }).lean();

        if (!existingApplicants.length) {
            return res.status(404).json({
                status: "failed",
                message: "No applicants found",
            });
        }

        res.status(200).json({
            status: "success",
            data: existingApplicants,
            count: existingApplicants.length,
        });
    } catch (error) {
        handleError(res, error, "Failed to fetch applicants");
    }
};

const getApplicant = async (req, res) => {
    try {
        const applicant = await User.findById(req.params.id).lean();

        if (!applicant) {
            return res.status(404).json({
                status: "failed",
                message: "Applicant not found",
            });
        }

        res.status(200).json({
            status: "success",
            data: applicant,
        });
    } catch (error) {
        handleError(res, error, "Invalid applicant ID");
    }
};

const deleteAllApplicants = async (req, res) => {
    try {
        const result = await User.deleteMany({ role: APPLICANT_ROLE });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                status: "failed",
                message: "No applicants found to delete",
            });
        }

        res.status(200).json({
            status: "success",
            message: `Successfully deleted ${result.deletedCount} applicant(s)`,
            deletedCount: result.deletedCount,
        });
    } catch (error) {
        handleError(res, error, "Failed to delete applicants");
    }
};

const deleteApplicant = async (req, res) => {
    try {
        const applicant = await User.findById(req.params.id);

        if (!applicant) {
            return res.status(404).json({
                status: "failed",
                message: "Applicant not found",
            });
        }

        if (applicant.role === ADMIN_ROLE) {
            return res.status(403).json({
                status: "failed",
                message: "Cannot delete an admin user",
            });
        }

        await User.deleteOne({ _id: req.params.id });

        res.status(200).json({
            status: "success",
            message: `${applicant.name} was deleted successfully`,
        });
    } catch (error) {
        handleError(res, error, "Invalid applicant ID");
    }
};

module.exports = {
    getAllApplicants,
    getApplicant,
    deleteApplicant,
    deleteAllApplicants,
};