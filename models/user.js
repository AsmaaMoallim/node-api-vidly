const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

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
    minlength: 10,
    maxlength: 1024,
    require: true,
  },
});

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const userSchema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    email: Joi.string().email().min(2).max(255).required(),
    password: Joi.string()
      .min(8)
      .max(10)
      .required()
      .custom(validatePassword, "wrong password"),
  });
  return userSchema.validate(user);
}

const validatePassword = (value) => {
  const complexityOptions = {
    min: 10,
    max: 30,
    lowerCase: 3,
    upperCase: 2,
    numeric: 1,
    symbol: 1,
    requirementCount: 2,
  };
  const passError = passwordComplexity(complexityOptions).validate(value);
  if (passError.error) throw new Error(passError.error.details[0].message);

  return;
};

exports.User = User;
exports.validate = validateUser;
exports.validatePass = validatePassword;
