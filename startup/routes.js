const express = require("express");
const home = require("../routes/home");
const genres = require("../routes/genres");
const customers = require("../routes/customers");
const movies = require("../routes/movies");
const rentals = require("../routes/rentals");
const users = require("../routes/users");
const returns = require("../routes/returns");
const auth = require("../routes/auth");
const error = require("../middlewares/error");

module.exports = function (app) {
  // middlewares
  app.use(express.json());
  app.use("/", home);
  app.use("/vidly.com/api/genres", genres);
  app.use("/vidly.com/api/customer", customers);
  app.use("/vidly.com/api/movies", movies);
  app.use("/vidly.com/api/rentals", rentals);
  app.use("/vidly.com/api/users", users);
  app.use("/vidly.com/api/returns", returns);
  app.use("/vidly.com/api/auth", auth);

  // after all other middlewares
  app.use(error); //just pass the refrence of the function
};
