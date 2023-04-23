const HttpError = require("../models/http-error");
const jwt = require("jsonwebtoken");
module.exports = function (req, res, next) {
  try {
    //Authorization: 'Bearer TOKEN' ... split on space[1] gives us the token
    const token = req.header.authorization.split(" ")[1];

    if (!token) {
      const error = new HttpError("Authentication failed.");
    }
    //validating the token
    const decodedToken = jwt.verify(token, "supersecret_dont_share");
    //add data to the request
    req.userData = { userId: decodedToken.userId };
    //let request continue
    next();
  } catch (err) {
    const error = new HttpError("Authentication failed.", 401);
    return next(error);
  }
};
