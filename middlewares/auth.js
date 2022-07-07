const jwt = require("jsonwebtoken");
const config = require("config");

function auth(req, res, next) {
      if (!config.get("requiresAuth")) return next();

  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("not authorised");

  try {
    const decoded = jwt.verify(token, config.get("jwtTokenSecret")); // this returns the payload or throws an error
     req.user = decoded;  // put it in the request.. to be proccesed by the next rout handeler
     next();
  } catch (ex) {
    res.status(400).send("invalid token");
  }
}


module.exports = auth;