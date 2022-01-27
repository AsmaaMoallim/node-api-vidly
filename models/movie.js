const mongoose = require("mongoose");
const { genreSchema } = require("./genre");
const Joi = require("joi");

const Movie = mongoose.model(
  "Movie",
  mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5,
      maxlength: 255,
    },
    genre: {
      type: genreSchema,
      required: true,
    },
    numberInStock: {
      type: Number,
      required: true,
      min: 0,
      max: 255,
    },
    dailyRentalRate: {
      type: Number,
      required: true,
      min: 0, // we do not want a negative number
      max: 255,
    },
  })
);

async function validateMovie(movie) {
  const movieSchema = Joi.object({
    title: Joi.string().required(),
    // genre: Joi.custom((value) => {
    //   validate(value);
    // }),
    genreId: Joi.string().required(), // because we want the clint to only send an id not a genra object
    numberInStock: Joi.number(),
    dailyRentalRate: Joi.number(),
  });

  return movieSchema.validate(movie);
}

exports.Movie = Movie;
exports.validate = validateMovie;
