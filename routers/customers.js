const { Customer, validate } = require("../models/customer");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

// get method all
router.get("/", async (req, res) => {
  const customers = await Customer.find().sort("name");
  if (!customers) return res.status(404).send("No Customers exixt.. ");
  res.send(customers);
});

// get method one
router.get("/:id", async (req, res) => {
  const customer = await Customer.find({ _id: req.params.id });
  if (!customer || customer.length==0) return res.status(404).send("Customer does not exixt.. ");
  res.send(customer);
});

// post method one
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.message);

  const customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  });

  await customer.save();
  // if (!result) return res.status(400).send(" Error: ", error.message);
  res.send(customer);
});

// put method one
router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.message);

  let customer = await Customer.findByIdAndUpdate(
    { _id: req.params.id },
    {
      name: req.body.name,
      phone: req.body.phone,
      isGold: req.body.isGold,
    },
    { new: true }
  );
  if (!customer) return res.status(404).send("Customer does not exixt.. ");

  res.send(customer);
});

// delete method one
router.delete("/:id", async (req, res) => {
  let customer = await Customer.findByIdAndRemove(req.params.id);
  if (!customer) return res.status(404).send("Customer does not exixt.. ");
  res.send(customer);
});

module.exports = router;
