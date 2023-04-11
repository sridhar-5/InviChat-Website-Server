const mongoose = require("mongoose");

const productPurchase = new mongoose.Schema({
  productId: Number,
  quantity: Number,
  purchaseMonth: String,
  purchaseYear: String,
  productPrice: Number,
  status: {
    type: String,
    enum: [
      "order_placed",
      "dispatched",
      "out_for_delivery",
      "delivered",
      "cancelled",
    ],
    default: "order_placed",
  },
});

const ProductPurchaseModel = mongoose.model(
  "products-purchase",
  productPurchase
);

module.exports = ProductPurchaseModel;
