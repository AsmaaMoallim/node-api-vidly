const mongoose = require("mongoose");
const exprees = require("express");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const { Rental, validate } = require("../models/rental");
const router = exprees.Router();

// get all method
router.get("/", async (req, res) => {
  const rentals = await Rental.find();
  if (!rentals || rentals.length == 0)
    return res.status(400).send("No Rentals exixt.. ");
  res.send(rentals);
});

// get one method
router.get("/:id", async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if (!rental) return res.status(400).send("Rental does not exixt.. ");
  res.send(rental);
});

// post method
router.post("/", async (req, res) => {
  const { error } = await validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // make sure the customer id is an actual one ... in the genre collection
  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("invalid customer...");

  // make sure the movie id is an actual one ... in the genre collection
  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("invalid movie...");

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not in stock.");

  const rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  const result = await rental.save();
  if (!result) return res.status(400).send("Some Error occured");
  res.send(result);
});

// put method
router.put("/:id", async (req, res) => {
  const { error } = await validate(req.body);
  if (error) return res.status(400).send("Rental does not exixt.. ");

  // make sure the customer id is an actual one ... in the genre collection
  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("invalid customer...");

  // make sure the movie id is an actual one ... in the genre collection
  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("invalid movie...");

  const rental = await Rental.findByIdAndUpdate(
    { _id: id },
    {
      customer: {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone,
      },
      movie: {
        _id: movie._id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate,
      },
    },
    { new: true }
  );

  if (!rental) return res.status(400).send("Some Error occured");
  res.send(rental);
});

// delete  method
router.delete("/:id", async (req, res) => {
  const rental = await Rental.findByIdAndRemove({ _id: req.params.id });
  if (!rental) return res.status(400).send("Rental does not exixt.. ");
  res.send(rental);
});

module.exports = router;
