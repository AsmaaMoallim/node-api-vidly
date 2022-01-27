const express = require("express");
const home = require("./routers/home");
const genres = require("./routers/genres");
const courses = require("./routers/courses");
const app = express();
const mongoose = require("mongoose");

// coonnecting to the mongodb
mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => console.log("Connected to mongodb..."))
  .catch((err) =>
    console.error("Failed to connect to mongodb...\n ", err.message)
  );

// json middleware
app.use(express.json());
app.use("/", home);
app.use("/vidly.com/api/genres", genres);
app.use("/vidly.com/api/courses", courses);

// listening to port
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
