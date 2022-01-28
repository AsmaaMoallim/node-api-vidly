const { User, validate } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

// get method all
router.get("/", async (req, res) => {
  const users = await User.find().sort("name");
  if (!users || users.length == 0) return res.status(404).send("No users exixt.. ");
  res.send(users);
});

// get method one
router.get("/:id", async (req, res) => {
  const user = await User.find({ _id: req.params.id });
  if (!user || user.length==0) return res.status(404).send("User does not exixt.. ");
  res.send(user);
});

// post method one
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.message);

  const user = new user({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  await user.save();
  // if (!result) return res.status(400).send(" Error: ", error.message);
  res.send(user);
});

// put method one
router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.message);

  let user = await User.findByIdAndUpdate(
    { _id: req.params.id },
    {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    },
    { new: true }
  );
  if (!user) return res.status(404).send("User does not exixt.. ");

  res.send(user);
});

// delete method one
router.delete("/:id", async (req, res) => {
  let user = await User.findByIdAndRemove(req.params.id);
  if (!user) return res.status(404).send("User does not exixt.. ");
  res.send(user);
});

module.exports = router;
