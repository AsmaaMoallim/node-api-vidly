const mongoose = require("mongoose");
const { movieSchema } = require("../models/movie");
const { customerSchema } = require("../models/customer");
const Joi = require("joi");

const rentalSechma = mongoose.Schema({
  customer: {
    type: customerSchema,
    required: true,
  },
  movie: {
    type: movieSchema,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
});

const Rental = mongoose.model("Rental", rentalSechma);

async function validateRental(rental) {
  const rentalSechma = Joi.object({
    customerId: Joi.string().required(),
    movieId: Joi.string().required(),
    price: Joi.number(),
  });

  return rentalSechma.validate(rental);
}

exports.Rental = Rental;
exports.validate = validateRental;
