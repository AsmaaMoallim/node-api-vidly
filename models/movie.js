const mongoose = require('mongoose')
const {genreSchema , validate} = require("./genre")
const Joi = require("joi");


const Movie = mongoose.model(
  "Movie",
  mongoose.Schema({
    title: String,
    genre: genreSchema,
    numberInStock : Number,
    dailyRentalRate : Number,
  })
);



async function validateMovie(movie){
    const movieSchema = Joi.object({
      title: Joi.string().required(),
      genre: Joi.custom((value) => {
        validate(value);
      }),
      numberInStock: Joi.number(),
      dailyRentalRate: Joi.number(),
    });

    return movieSchema.validate(movie)
}

exports.Movie = Movie;
exports.validate = validateMovie;