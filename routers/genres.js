const express = require("express");
const router = express.Router();
const Joi = require("joi");
const mongoose = require("mongoose");

// coonnecting to the mongodb
mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => console.log("Connected to mongodb..."))
  .catch((err) =>
    console.error("Failed to connect to mongodb...\n ", err.message)
  );

// defining the schema
const genreSchema = mongoose.Schema({
  genreName: {
    type: String,
    required: true,
    lowercase: true,
  },
});

// combiling the shcema into a model and creating the collection
const Genre = mongoose.model("Genre", genreSchema);

// creating a genre
async function createGenre(newgenre) {
  const genre = new Genre({
    genreName: newgenre.genreName,
  });

  try {
    const result = await genre.save();
    console.log("result after saving in mongodb: ", result);
    return result;
  } catch (err) {
    for (e in err.erros) {
      console.error("Error: ", err.errors[e].message);
    }
  }
}

// getting all genres
async function getGenres() {
  try {
    const genres = await Genre.find();
    if (!genres) return console.log("no genres found");
    console.log(genres);
    return genres;
  } catch (err) {
    console.error("Error: ", err.message);
    // for (e in err.erros) {
    //   console.error("Error: ", err.errors[e].message);
    // }
  }
}

// getting a genre
async function getGenre(id) {
  try {
    const genre = await Genre.findById(id);
    if (!genre) return console.log("no genre found");
    console.log(genre);
    return await genre;
  } catch (err) {
    console.error("Error from getGenre fun: ", err.message);
    // for (e in err.erros) {
    //   console.error("Error: ", err.errors[e].message);
    // }
  }
}

// updating a genre
async function updateGenre(id, genre) {
  try {
    const result = await Genre.findByIdAndUpdate(
      id,
      {
        genreName: genre.genreName,
      },
      { new: true }
    ); // to return the updated one
    console.log(result);
    return result;
  } catch (err) {
    for (e in err.erros) {
      console.error("Error: ", err.errors[e].message);
    }
  }
}

// deleteing a genre
async function removeGenre(id) {
  const result = await Genre.findByIdAndRemove(id)
    .then((result) => {
      console.log(result);
      return result;
    })
    .catch((err) => {
      console.error("Error from removeGenre fun: ", err.message);
    });
}

// validiation function using joi
function validateGenre(genre) {
  const schema = Joi.object({
    genreName: Joi.string().required(),
  });
  return schema.validate(genre);
}

// get all method
router.get("/", (req, res) => {
  // res.send(genres);
  async function getallGenrefromdb() {
    const genres = await getGenres()
      .then((genres) => {
        res.send(genres);
      })
      .catch((err) => {
        res.status(400).send("No genres exist");
        console.log("logging in the get all api router", err.message);
      });
  }
  getallGenrefromdb();
});

// get one method
router.get("/:id", (req, res) => {
  async function getOneGenrefromdb() {
    const genre = await getGenre(req.params.id)
      .then((genre) => {
        res.send(genre);
      })
      .catch((err) => {
        res.status(400).send("this genre does not exist");
        console.log("logging in the get one api router", err.message);
      });
  }
  getOneGenrefromdb();
});

// post method
router.post("/", (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.message);

  const genre = {
    genreName: req.body.genreName,
  };

  async function getcreatedGenrefromdb() {
    const newGenre = await createGenre(genre)
      .then((newGenre) => {
        res.send(newGenre);
      })
      .catch((err) => {
        console.log("logging in the post api router", err.message);
        res.status(400).send(error.message);
      });
  }
  getcreatedGenrefromdb();
});

// put method
router.put("/:id", (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.message);

  async function updateGenrefromdb() {
    const updatedGenre = await updateGenre(req.params.id, req.body)
      .then((updatedGenre) => {
        // get the updated one and send to response
        res.send(updatedGenre);
      })
      .catch((err) => {
        res.status(400).send("you updating a genre that does not exist");
        console.log("logging in the put one api router", err.message);
      });
  }

  updateGenrefromdb();
});

// delete method
router.delete("/:id", (req, res) => {
  async function deleteOneGenrefromdb() {
    const genre = await removeGenre(req.params.id)
      .then((result) => {
        console.log(genre);
        res.send(genre);
      })
      .catch((err) => {
        res.status(400).send("you deleting a genre that does not exist");
        console.log("logging in the delete one api router", err.message);
      });
  }
  deleteOneGenrefromdb();
});
module.exports = router;
