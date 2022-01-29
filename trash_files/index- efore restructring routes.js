require("express-async-errors"); // it wraps every router called with a next ... so the error middleware will work becase it comes after everything called...
// the logging of errors
const winston = require("winston");
// after requiring winston
require("winston-mongodb");
winston.add(new winston.transports.Console());
winston.add(new winston.transports.File({ filename: "myLogginFile.json" })); //here you crete a new transport other than the default one
winston.add(
  new winston.transports.MongoDB({ db: "mongodb://localhost/vidly" })
); //here you create a new transport other than the default one

// this is to handell uncaughtExceptions  (only synchrnous)
process.on("uncaughtException", (ex) => {
  console.log(ex.message, ex);
  winston.error(ex.message, ex);
  process.exit(); // it better to exit and restart with a process manager
});
// throw new Error("outside the express..")

// this is to handell uncaughtExceptions   (asynchrnous)
process.on("unhandledRejection", (ex) => {
  console.log(ex.message, ex);
  winston.error(ex.message, ex);
  process.exit(); // it better to exit and restart with a process manager
});

// const e = new Error("just to test rejected promise")
// const p = Promise.reject(e);
// p.then(() => console.error("haha"));

const config = require("config");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const express = require("express");
const home = require("../routes/home");
const genres = require("../routes/genres");
const customers = require("../routes/customers");
const movies = require("../routes/movies");
const rentals = require("../routes/rentals");
const users = require("../routes/users");
const auth = require("../routes/auth");
const error = require("../middlewares/error");
const app = express();
const mongoose = require("mongoose");

// if configeration variable is not define then catch the error
if (!config.get("jwtTokenSecret")) {
  console.log("Token Secret : jwtTokenSecret is not defined..");
  process.exit(1); // exit the node or nodemon by ending the process and application wonit response
}
// coonnecting to the mongodb
mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => console.log("Connected to mongodb..."))
  .catch((err) =>
    console.error("Failed to connect to mongodb...\n ", err.message)
  );

// middlewares
app.use(express.json());
app.use("/", home);
app.use("/vidly.com/api/genres", genres);
app.use("/vidly.com/api/customer", customers);
app.use("/vidly.com/api/movies", movies);
app.use("/vidly.com/api/rentals", rentals);
app.use("/vidly.com/api/users", users);
app.use("/vidly.com/api/auth", auth);

// after all other middlewares
app.use(error); //just pass the refrence of the function

// listening to port
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
