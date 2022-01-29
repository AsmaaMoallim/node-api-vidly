const config = require("config");

module.exports = function () {
  // if configeration variable is not define then catch the error
  if (!config.get("jwtTokenSecret")) {
    // console.log("Token Secret : jwtTokenSecret is not defined..");
    throw new Error("Fatal Error : jwtTokenSecret is not defined..");
    // process.exit(1); // exit the node or nodemon by ending the process and application wonit response
  }
};
