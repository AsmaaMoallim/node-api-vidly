const bcrypt = require("bcrypt");
const { User, validatePass } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Joi = require("joi");


// post method one
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.message);

  const user = await User.findOne({ email: req.body.email });
  //   if (user) return res.status(400).send(" Invalid email or password.. ");
  if (!user) return res.status(400).send(" Invalid email.. ");

  const validPass = await bcrypt.compare(req.body.password, user.password);
  //   if (!validPass) return res.status(400).send(" Invalid email or password.. ");
  if (!validPass) return res.status(400).send(" Invalid password.. ");

  //   const token = jwt.sign({_id : user._id}, "jwtSecretKey") // the key should  be an environment variable and obtined in the configuration file.. and not should be stored in the source code just like the database pass word .. or any other secret data
  // const token = jwt.sign({ _id: user._id }, config.get("jwtTokenSecret"));

  const token = user.generateUserToken();
  res.send(token);

  // res.send(true);
})

function validate(user) {
  const userSchema = Joi.object({
    email: Joi.string().email().min(2).max(255).required(),
    password: Joi.string()
      .min(8)
      .max(10)
      .required()
      .custom(validatePass, "wrong password"),
  });
  return userSchema.validate(user);
}

module.exports = router;
