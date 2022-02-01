const admin = require("../middlewares/admin");
const asyncMiddleware = require("../middlewares/aync");
const validateObjectId = require("../middlewares/validateObjectId");
const auth = require("../middlewares/auth");
const { Genre, validate } = require("../models/genre");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res, next) => {
  // just for testing winston
  // throw new Error("Oppos! did not get the genres.. ");

  // try {
  const genres = await Genre.find().sort("name");
  if (!genres || genres.length == 0)
    return res.status(400).send("No Genres exixt.. ");
  res.send(genres);
  // } catch (ex) {
  //   next(ex); // the error middleware .. passin the exception to it
  // }
});

// router.get(
//   "/",
//   asyncMiddleware(async (req, res, next) => {
//     // try {
//     const genres = await Genre.find().sort("name");
//     if (!genres || genres.length == 0)
//       return res.status(400).send("No Genres exixt.. ");
//     res.send(genres);
//     // } catch (ex) {
//     //   next(ex); // the error middleware .. passin the exception to it
//     // }
//   })
// );

router.get("/:id", validateObjectId, async (req, res) => {
  // if (!mongoose.Types.ObjectId.isValid(req.params.id))
  //   return res.status(404).send("invalid Id");
  const genre = await Genre.findById(req.params.id);

  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  res.send(genre);
});

router.post(
  "/",
  auth /* this is an optional args for middlewares */,
  async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = new Genre({ name: req.body.name });
    await genre.save();

    res.send(genre);
  }
);

router.put("/:id", auth, validateObjectId, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    {
      new: true,
    }
  );

  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  res.send(genre);
});

router.delete("/:id", auth, admin, validateObjectId, async (req, res) => {
  try {
    const genre = await Genre.findByIdAndRemove({
      _id: req.params.id,
    });
    if (!genre)
      return res.status(404).send("The genre with the given ID was not found.");

    res.send(genre);
  } catch (ex) {
    return res.status(404).send("invalid input");
  }
});

module.exports = router;
