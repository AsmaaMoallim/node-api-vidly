const { logger } = require("./logging");
const mongoose = require("mongoose");
const config = require("config");
module.exports = function () {
  db = config.get("db");
  // coonnecting to the mongodb
  mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => logger.info(`Connected to ${db}...`));
  // .then(() => console.log("Connected to mongodb..."))
  // .catch((err) =>
  //   console.error("Failed to connect to mongodb...\n ", err.message)
  // );
};
