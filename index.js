const Joi = require("joi");
const express = require("express");
const app = express();

// json middleware 
app.use(express.json())

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

// get method
app.get("/" || "/vidly.com", (req, res) => {
  res.send("Welcome to Vidly");
});

app.get("/vidly.com/api/genres", (req, res) => {
  res.send(genres);
});

app.get("/vidly.com/api/genres/:id", (req, res) => {
  const genre = genres.find((g) => g.id === parseInt(req.params.id));
  if (!genre) return res.status(400).res.send("this genre does not exist");

  res.send(genre);
});

// post method
app.post("/vidly.com/api/genres", (req, res) => {
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
app.put("/vidly.com/api/genres/:id", (req, res) => {
  const genre = genres.find((g) => g.id === parseInt(req.params.id));
  if (!genre)
    return res.status(400).res.send("you updating a genre that does not exist");

  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.message);

  genre.genreName = req.body.genreName;
  res.send(genre);
});

// delete method 
app.delete("/vidly.com/api/genres/:id", (req, res) => {
  const genre = genres.find((g) => g.id === parseInt(req.params.id));
  if (!genre) return res.status(400).res.send("you deleting a genre that does not exist");

  const indexOfGenre = genres.indexOf(genre);
  genres.splice(indexOfGenre,1);
  res.send(genre);
});

// listening to port
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
