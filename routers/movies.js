const mongoose = require("mongoose");
const exprees = require("express");
const { Movie, validate } = require("../models/movie");
const router = exprees.Router();

// get all method
router.get("/", async (req, res) => {
  const movies = await Movie.find();
  if (!movies || movies.length == 0) return res.status(400).send("No Movies exixt.. ");
  res.send(movies);
});

// get one method
router.get("/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(400).send("Movie does not exixt.. ");
  res.send(movie);
});

// post method
router.post("/", async (req, res) => {
  const { error } = await validate(req.body);
  if (error) return res.status(400).send("Movie does not exixt.. ");

  const movie = new Movie({
    title: req.body.title,
    genre: req.body.genre,
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });

  const result = await movie.save();
  if (!result) return res.status(400).send("Some Error occured");
  res.send(result);
});

// put method
router.put("/:id", async (req, res) => {
  const { error } = await validate(req.body);
  if (error) return res.status(400).send("Movie does not exixt.. ");

  const movie = await Movie.findByIdAndUpdate(
    { _id: id },
    {
      title: req.body.title,
      genre: req.body.genre,
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    },
    { new: true }
  );

  if (!movie) return res.status(400).send("Some Error occured");
  res.send(movie);
});

// delete  method
router.delete("/:id", async (req, res) => {
  const movie = await Movie.findByIdAndRemove({ _id: req.params.id });
  if (!movie) return res.status(400).send("Movie does not exixt.. ");
  res.send(movie);
});

module.exports = router;
