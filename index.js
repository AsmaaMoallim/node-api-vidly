const express = require("express");
const home = require("./routers/home");
const genres = require("./routers/genres");
const app = express();

// json middleware
app.use(express.json());
app.use("/", home);
app.use("/vidly.com/api/genres", genres);

// listening to port
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
