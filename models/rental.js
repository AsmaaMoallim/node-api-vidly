const moment = require("moment");
const Joi = require("joi");
const mongoose = require("mongoose");
const rentalSchema = new mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
      },
      isGold: {
        type: Boolean,
        default: false,
      },
      phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
      },
    }),
    required: true,
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255,
      },
      dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255,
      },
    }),
    required: true,
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dateReturned: {
    type: Date,
  },
  rentalFee: {
    type: Number,
    min: 0,
  },
});
rentalSchema.statics.lookUp = function (customerId, movieId) {
  return this.findOne({ "customer._Id": customerId, "movie._Id": movieId });
};
rentalSchema.methods.return = function () {
  this.dateReturned = new Date();
  const rentalDays = moment().diff(this.dateOut, "days");
  this.rentalFee = rentalDays * this.movie.dailyRentalRate;
  return this.rentalFee;
};
const Rental = mongoose.model("Rental", rentalSchema);

async function validateRental(rental) {
  const rentalSechma = Joi.object({
    // customerId: Joi.string().required(),
    // movieId: Joi.string().required(),
    customerId: Joi.objectId().required(), // validating fusing joi-objectid packeage
    movieId: Joi.objectId().required(),
  });

  return rentalSechma.validate(rental);
}

exports.Rental = Rental;
exports.validate = validateRental;
