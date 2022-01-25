const express = require("express");
const router = express.Router();
const Joi = require("joi");

// validiation function using joi
function validateGenre(genre) {
  const schema = Joi.object({
    genreName: Joi.string().required(),
  });
  return schema.validate(genre);
}

// defining the genres array
const genres = [
  {
    id: 1,
    genreName: "horror",
  },
  {
    id: 2,
    genreName: "romance",
  },
  {
    id: 3,
    genreName: "drama",
  },
  {
    id: 4,
    genreName: "fiction",
  },
];

router.get("/", (req, res) => {
  res.send(genres);
});

router.get("/:id", (req, res) => {
  const genre = genres.find((g) => g.id === parseInt(req.params.id));
  if (!genre) return res.status(400).send("this genre does not exist");

  res.send(genre);
});

// post method
router.post("/", (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.message);

  const genre = {
    id: genres.length + 1,
    genreName: req.body.genreName,
  };
  genres.push(genre);
  res.send(genre);
});

// put method
router.put("/:id", (req, res) => {
  const genre = genres.find((g) => g.id === parseInt(req.params.id));
  if (!genre)
    return res.status(400).send("you updating a genre that does not exist");

  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.message);

  genre.genreName = req.body.genreName;
  res.send(genre);
});

// delete method
router.delete("/:id", (req, res) => {
  const genre = genres.find((g) => g.id === parseInt(req.params.id));
  if (!genre)
    return res.status(400).send("you deleting a genre that does not exist");

  const indexOfGenre = genres.indexOf(genre);
  genres.splice(indexOfGenre, 1);
  res.send(genre);
});
module.exports = router;
