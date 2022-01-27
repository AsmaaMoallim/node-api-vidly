const mongoose = require("mongoose");
const express = require("express");
const Joi = require("joi");
const router = express.Router();

// course document schema
const courseSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 20,
    minlength: 2,
  },
  phone: {
    type: String,
    required: true,
    maxlength: 10,
    minlength: 2,
  },
  isGold: {
    type: Boolean,
    required: true,
  },
});

// compile the schema into a model and create colliction
const Course = mongoose.model("Course", courseSchema);

// get method all
router.get("/", async (req, res) => {
  const courses = await Course.find().sort("name");
  if (!courses) return res.status(404).send("No courses exixt.. ");
  res.send(courses);
});

// get method one
router.get("/:id", async (req, res) => {
  const course = await Course.find({ _id : req.params.id});
  if (!course) return res.status(404).send("Courses does not exixt.. ");
  res.send(course);
});

// post method one
router.post("/", async (req, res) => {
  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error.message);

  const course = new Course({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  });

  const result = await course.save();
  if(!result) return res.status(400).send(" Error: ", error.message);
  res.send(result);
});

// put method one
router.put("/:id", async (req, res) => {
  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error.message);

  let course = await Course.findByIdAndUpdate(
    { _id: req.params.id },
    {
      name: req.body.name,
      phone: req.body.phone,
      isGold: req.body.isGold,
    },
    { new: true }
  );
  if (!course) return res.status(404).send("Course does not exixt.. ");

  res.send(course);
});

// delete method one
router.delete("/:id", async (req, res) => {
  let course = await Course.findByIdAndRemove(req.params.id);
  if (!course) return res.status(404).send("Courses does not exixt.. ");
  res.send(course);
});

// joi validation function
function validateCourse(course) {
  const courseSchema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.number().required(),
    isGold: Joi.boolean().required(),
  });
  
  return courseSchema.validate(course);;
}

module.exports = router;
