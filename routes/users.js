const auth = require("../middlewares/auth");
const bcrypt = require("bcrypt");
const { User, validate } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const lodash = require("lodash");

// get method all
router.get("/", async (req, res) => {
  const users = await User.find().sort("name").select({ password: -1 });
  if (!users || users.length == 0)
    return res.status(404).send("No users exixt.. ");
  res.send(users);
});

// get method one
router.get("/:id", async (req, res) => {
  const user = await User.findById( req.params.id );
  if (!user || user.length==0) return res.status(404).send("User does not exixt.. ");
  res.send(user);
});

// get method : current user
router.get("/user/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select({password:0});
  if (!user || user.length == 0)
    return res.status(404).send("User does not exixt.. ");
  res.send(user);
});

// post method one
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send(" User already registered.. ");

  // user = new User({
  //   name: req.body.name,
  //   email: req.body.email,
  //   password: req.body.password,
  // });

  user = new User(lodash.pick(req.body, ["name", "email", "password","isAdmin"]));
  user.password = await bcrypt.hash(user.password, 10);
  await user.save();

  // const token = jwt.sign({ _id: user._id }, config.get("jwtTokenSecret"));
  const token = user.generateUserToken();

  res
    .header("x-auth-token", token)
    .send(lodash.pick(user, ["_id", "name", "email" /*, "password" */]));
  // res.send({
  //   name : user.name,
  //   email : user.email
  // });
  // res.send(user);
});

// // put method one
// router.put("/:id", async (req, res) => {
//   const { error } = validate(req.body);
//   if (error) return res.status(400).send(error.message);

//   let user = await User.findByIdAndUpdate(
//     { _id: req.params.id },
//     {
//       name: req.body.name,
//       email: req.body.email,
//       password: req.body.password,
//     },
//     { new: true }
//   );
//   if (!user) return res.status(404).send("User does not exixt.. ");

//   res.send(user);
// });

// // delete method one
// router.delete("/:id", async (req, res) => {
//   let user = await User.findByIdAndRemove(req.params.id);
//   if (!user) return res.status(404).send("User does not exixt.. ");
//   res.send(user);
// });

module.exports = router;
