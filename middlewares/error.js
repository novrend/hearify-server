module.exports = (err, req, res, next) => {
  let code = 500;
  let msg = "Internal Server Error";
  if (err.name === "JsonWebTokenError") {
    code = 401;
    msg = "Invalid token";
  } else if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError"
  ) {
    code = 400;
    msg = err.errors[0].message;
  } else if (err.name === "SequelizeDatabaseError") {
    code = 404;
    msg = "Data Not Found";
  } else if (err.code) {
    code = err.code;
    msg = err.msg;
  } else if (err.name === "WebapiRegularError") {
    code = err.body.error.status;
    msg = err.body.error.message;
  }
  res.status(code).json({
    message: msg,
  });
};
