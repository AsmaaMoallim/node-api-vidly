const {logger} = require("./logging");
const mongoose = require("mongoose");

module.exports = function () {
  // coonnecting to the mongodb
  mongoose
    .connect("mongodb://localhost/vidly")
    .then(() => logger.info("Connected to mongodb..."));
  // .then(() => console.log("Connected to mongodb..."))
  // .catch((err) =>
  //   console.error("Failed to connect to mongodb...\n ", err.message)
  // );
};
