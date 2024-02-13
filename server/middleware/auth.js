const jwt = require("jsonwebtoken");
const createError = require("../utils/createError");
module.exports = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    const decode=jwt.verify(token, process.env.SECRET_KEY, (err, decode) => {
      if (err) {
        next(createError({ status: 401, message: "Token is not valid" }));
      } else {
        req.decode = decode;
        next();
      }
    });
  } else {
    next(createError({ status:400,message:"Authorization header missing"}));
  }
};
