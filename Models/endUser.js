const mongoose = require("mongoose");

const endUser = new mongoose.Schema({
  Name: String,
  Age: Number,
  phone: String,
  email: String,
  preference_tags: [String],
});

const customerModel = mongoose.model("enduser-data", endUser);

module.exports = customerModel;
