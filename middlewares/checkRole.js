const jwt = require("jsonwebtoken");
const NotAuthorizedError = require("../errors/not-authorized-error");

const isAuthorizedUser = () => {
  return (req, res, next) => {
    if (req.currentUser?.role !== "admin") {
      throw new NotAuthorizedError();
    }
    next();
  };
};

module.exports = { isAuthorizedUser };
