const express = require("express");
// const winston = require("winston");
const app = express();
require("./startup/config")();
// const { fun } = require("./startup/logging")();
const { logger } = require("./startup/logging");
require("./startup/validation")();
require("./startup/routes")(app);
require("./startup/db")();

// listening to port
const port = process.env.PORT || 5500;
const server = app.listen(port, () => {
  // console.log(`Listening to port ${port}`);
  logger.info(`Listening to port ${port}`); // use winiston rather than consol log
});

module.exports = server;
