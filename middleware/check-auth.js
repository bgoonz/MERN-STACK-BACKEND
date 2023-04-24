const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
module.exports = function (req, res, next) {
  if (req.method === "OPTIONS") {
    // this will not necessarily allow the post request to continue but it will allow the options request to continue.
    return next();
  }
  try {
    //Authorization: 'Bearer TOKEN' ... split on space[1] gives us the token
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      const error = new HttpError("Authentication failed.");
    }
    //validating the token
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    //add data to the request
    req.userData = { userId: decodedToken.userId };
    //let request continue
    next();
  } catch (err) {
    const error = new HttpError("Authentication failed.", 403);
    return next(error);
  }
};
