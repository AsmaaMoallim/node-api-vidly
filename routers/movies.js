const mongoose = require("mongoose");
const exprees = require("express");
const { Movie, validate } = require("../models/movie");
const router = exprees.Router();
const { Genre } = require("../models/genre");
// get all method
router.get("/", async (req, res) => {
  const movies = await Movie.find();
  if (!movies || movies.length == 0)
    return res.status(400).send("No Movies exixt.. ");
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

  // make sure the genre id is an actual one ... in the genre collection
  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("invalid genre...");

  const movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id, // we read it from the genre that we loaded above
      name: genre.name, // we read it from the genre that we loaded above
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });

  // const result = await movie.save();
  await movie.save(); // we do not need to store it again to get the id !! because the ide is already set before saving
  // if (!result) return res.status(400).send("Some Error occured");
  res.send(movie);
});

// put method
router.put("/:id", async (req, res) => {
  const { error } = await validate(req.body);
  if (error) return res.status(400).send("Movie does not exixt.. ");

  // make sure the genre id is an actual one ... in the genre collection
  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("invalid genre...");

  const movie = await Movie.findByIdAndUpdate(
    { _id: id },
    {
      title: req.body.title,
      genre: {
        _id: genre._id, // we read it from the genre that we loaded above
        name: genre.name, // we read it from the genre that we loaded above
      },
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
