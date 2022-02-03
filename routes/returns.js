const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { Rental } = require("../models/rental");
const { Movie } = require("../models/movie");
const Joi = require("joi");
const validate = require("../middlewares/validate");
router.post("/", auth, validate(validateReturn), async (req, res, next) => {
  // if (req.header("x-auth-token")) {
  //   res.status(400).send("Unauthorized");
  // }
  //   if (!req.body.customerId)
  //     return res.status(400).send("no customer id is provided");
  //   if (!req.body.movieId) return res.status(400).send("no movie id is prvided");

  const rental = await Rental.lookUp(req.body.customerId, req.body.movieId);
  if (!rental) return res.status(404).send("not Found");
  if (rental.dateReturned) return res.status(400).send("allready processed");

  rental.return();
  await rental.save();

  await Movie.updateOne(
    { _id: rental.movie._id },
    {
      $inc: {
        numberInStock: 1,
      },
    }
  );

  //   return res.status(200).send(rental.dateReturned);
  return res.send(rental);
  // res.status(401).send("Unauthorized");
});

function validateReturn(req) {
  const genreSchema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });

  return genreSchema.validate(req);
}

module.exports = router;
