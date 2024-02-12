const createError = require("../utils/createError");

module.exports.notFound = (req, res, next) => {
  const err = new Error("not found");
  err.status = 404;
  next(createError({ status: 404, message: "page not found" }));
};

module.exports.errorHandler = (err, req, res, next) => {
  res
    .status(err.status || 500)
    .json({ message: err.message || "something went wrong" });
};
