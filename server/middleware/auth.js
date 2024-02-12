const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, decode) => {
      if (err) {
        next(Error("Invalid Token"));
      } else {
        req.decode = decode;
        next();
      }
    });
  } else {
    next(Error("No Token Provided!"));
  }
};
