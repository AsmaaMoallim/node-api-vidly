const Joi = require("joi");
const mongoose = require("mongoose");


// Customer document schema
const customerSchema = new mongoose.Schema({
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
    default: false,
  },
});


// compile the schema into a model and create colliction
const Customer = mongoose.model("Customer", customerSchema);



// joi validation function
function validateCustomer(customer) {
  const customerSchema = Joi.object({
    name: Joi.string().min(2).max(20).required(),
    phone: Joi.string().required().min(2).max(10),
    isGold: Joi.boolean(),
  });
  
  return customerSchema.validate(customer);;
}


exports.Customer = Customer;
exports.validate = validateCustomer;
exports.customerSchema = customerSchema;