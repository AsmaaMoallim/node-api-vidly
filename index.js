const express = require("express");
// const winston = require("winston");
const app = express();

// enable cross origin resource sharing
const cors = require("cors");

const corsOptions = {
  exposedHeaders: "x-auth-token",
};

app.use(cors(corsOptions));

require("./startup/config")();
// const { fun } = require("./startup/logging")();
const { logger } = require("./startup/logging");
require("./startup/validation")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/prod")(app);


// listening to port
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  // console.log(`Listening to port ${port}`);
  logger.info(`Listening to port ${port}`); // use winiston rather than consol log
});

module.exports = server;
