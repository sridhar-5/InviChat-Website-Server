const mongoose = require("mongoose");

const productPurchase = new mongoose.Schema({
  productId: Number,
  quantity: Number,
  purchaseMonth: String,
  purchaseYear: String,
  productPrice: Number,
});

const ProductPurchaseModel = mongoose.model(
  "products-purchase",
  productPurchase
);

module.exports = ProductPurchaseModel;
