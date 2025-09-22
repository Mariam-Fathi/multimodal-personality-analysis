const { User } = require("../models/user"),
  dotenv = require("dotenv");

dotenv.config();

const getAllApplicants = async (req, res) => {
  try {
    const existingApplicants = await User.find({ role: "applicant" });

    if (existingApplicants.length == 0) {
      res.status(400).json({
        status: "failed",
        message: `No existing applicants to be shown!`,
      });
    } else {
      res.status(200).send(existingApplicants);
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

const getApplicant = async (req, res) => {
  try {
    const applicant = await User.findById(req.params.id);

    res.status(200).send(applicant);
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: `No existing applicant with the given ID!`,
    });
  }
};

const deleteAllApplicants = async (req, res) => {
  try {
    const existingApplicants = await User.find({ role: "applicant" });

    if (existingApplicants.length == 0) {
      res.status(400).json({
        status: "failed",
        message: `No existing applicants to be deleted!`,
      });
    } else {
      await User.deleteMany({ role: "applicant" });

      if (existingApplicants.length == 1) {
        res.status(200).json({
          status: "success",
          message: `Only one applicant deleted sucessfully.`,
        });
      } else {
        res.status(200).json({
          status: "success",
          message: `There are ${existingApplicants.length} applicants deleted sucessfully.`,
        });
      }
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteApplicant = async (req, res) => {
  try {
    const applicant = await User.findById(req.params.id);
    if (applicant.role === "admin") {
      res.status(400).json({
        status: "success",
        message: `Cannot delete an admin!`,
      });
    } else {
      const applicantName = applicant.name;

      await User.deleteOne(applicant);
      res.status(200).json({
        status: "success",
        message: `${applicantName} was deleted successfully.`,
      });
    }
  } catch (error) {
    res.status(400).json({
      status: "success",
      message: `Invalid ID!`,
    });
  }
};

module.exports = {
  getAllApplicants,
  getApplicant,
  deleteApplicant,
  deleteAllApplicants,
};
