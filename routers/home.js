const express = require("express");
const router = express.Router();

// get method
router.get("", (req, res) => {
  res.send("Welcome to Vidly");
});

module.exports = router;
