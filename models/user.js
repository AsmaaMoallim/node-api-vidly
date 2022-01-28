const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 255,
    require: true,
  },
  email: {
    type: String,
    unique: true,
    minlength: 2,
    maxlength: 255,
    require: true,
  },
  password: {
    type: String,
    minlength: 8,
    maxlength: 1024,
    require: true,
  },
});

const User = mongoose.model("User", userSchema);

async function validateUser(user) {
  const userSchema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    email: Joi.string().email().min(2).max(255).required(),
    password: Joi.password().required(),
  });
  return userSchema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
