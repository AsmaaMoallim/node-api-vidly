const config = require("config")
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const express = require("express");
const home = require("./routers/home");
const genres = require("./routers/genres");
const customers = require("./routers/customers");
const movies = require("./routers/movies");
const rentals = require("./routers/rentals");
const users = require("./routers/users");
const auth = require("./routers/auth");
const app = express();
const mongoose = require("mongoose");

// if configeration variable is not define then catch the error
if (!config.get("jwtTokenSecret")){
  console.log("Token Secret : jwtTokenSecret is not defined..");
  process.exit(1)  // exit the node or nodemon by ending the process and application wonit response
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


// listening to port
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
