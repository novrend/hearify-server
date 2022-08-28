module.exports = (err, req, res, next) => {
  let error = { statusCode: 500, message: "Internal Server Error" };
  if (err.name === "JsonWebTokenError") {
    error = { statusCode: 401, message: "Token Invalid" };
  } else if (err.name === 401) {
    error = { statusCode: 401, message: err.message };
  } else if (err.name === 403) {
    error = { statusCode: 403, message: err.message };
  } else if (
    err.name === "SequelizeDatabaseError" ||
    err.name === "SequelizeForeignKeyConstraintError"
  ) {
    error = { statusCode: 400, message: "Invalid input parameter" };
  } else if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError" ||
    err.name === 400
  ) {
    let errors = {};
    err.errors.forEach((el) => (errors[el.path] = el.message));
    error = { statusCode: 400, message: errors };
  } else if (err.name === 404) {
    error = { statusCode: 404, message: err.message };
  }
  console.log(err);
  res.status(error.statusCode).json({
    statusCode: error.statusCode,
    message: error.message,
  });
};
