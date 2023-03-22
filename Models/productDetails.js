const mongoose = require("mongoose");

const product = new mongoose.Schema({
  productName: String,
  productDescription: String,
  productPrice: Number,
  productQuantity: Number,
  NoOfPictures: Number,
  productImages: [String],
  Owner: String,
  productId: Number,
  Category: String,
});

const ProductModel = mongoose.model("products", product);

module.exports = ProductModel;
