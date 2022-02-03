const auth = require("../middlewares/auth");
const mongoose = require("mongoose");
const exprees = require("express");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const { Rental, validate } = require("../models/rental");
const router = exprees.Router();
const Fawn = require("fawn");

Fawn.init("mongodb://localhost/vidly"); // this is the new way of initilising
// Fawn.init(mongoose); // for handelling transictions

// // get all method
// router.get("/", async (req, res) => {
//   const rentals = await Rental.find();
//   if (!rentals || rentals.length == 0)
//     return res.status(400).send("No Rentals exixt.. ");
//   res.send(rentals);
// });

// // get one method
// router.get("/:id", async (req, res) => {
//   const rental = await Rental.findById(req.params.id);
//   if (!rental) return res.status(400).send("Rental does not exixt.. ");
//   res.send(rental);
// });

// post method
router.post("/", auth, async (req, res) => {
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
  try {
    new Fawn.Task()
      .save("rentals", rental) // we pass the collection name and the new rental object
      .update(
        { _id: movie.id },
        {
          $inc: { numberInStock: -1 }, // decreament by one
        }
      )
      .run(); // none will be breformed unless this function is called

    res.send(result);
  } catch (ex) {
    res.status(500).send("something went baaaad: ", ex.message);
  }

  /*  we need a transicton here ... mongo have something called two-phase commit .. it is not in this course 

  1- rental.save()
  ----
  movie.numberInStock--;
  2- movie.save()

  */
});

// // put method
// router.put("/:id", auth, async (req, res) => {
//   const { error } = await validate(req.body);
//   if (error) return res.status(400).send("Rental does not exixt.. ");

//   // make sure the customer id is an actual one ... in the genre collection
//   const customer = await Customer.findById(req.body.customerId);
//   if (!customer) return res.status(400).send("invalid customer...");

//   // make sure the movie id is an actual one ... in the genre collection
//   const movie = await Movie.findById(req.body.movieId);
//   if (!movie) return res.status(400).send("invalid movie...");

//   const rental = await Rental.findByIdAndUpdate(
//     { _id: id },
//     {
//       customer: {
//         _id: customer._id,
//         name: customer.name,
//         phone: customer.phone,
//       },
//       movie: {
//         _id: movie._id,
//         title: movie.title,
//         dailyRentalRate: movie.dailyRentalRate,
//       },
//     },
//     { new: true }
//   );

//   if (!rental) return res.status(400).send("Some Error occured");
//   res.send(rental);
// });

// // delete  method
// router.delete("/:id", auth, async (req, res) => {
//   const rental = await Rental.findByIdAndRemove({ _id: req.params.id });
//   if (!rental) return res.status(400).send("Rental does not exixt.. ");
//   res.send(rental);
// });

module.exports = router;
