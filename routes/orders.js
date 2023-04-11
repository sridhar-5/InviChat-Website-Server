const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ProductPurchaseModel = require("../Models/productPurchase");
const ProductModel = require("../Models/productDetails");

router.get("/", async (request, response) => {
  const purchases = await ProductPurchaseModel.find({});
  //find the product name by sending a request to the product service
  const responseData = [];
  var count = 1;
  for (const purchase of purchases) {
    const prod = await ProductModel.find({ productId: purchase.productId });
    responseData.push({
      key: count++,
      name: prod[0].productName,
      quantity: purchase.quantity,
      category: [prod[0].Category],
      status: [purchase.status],
    });
  }

  //sending back shape of { Name, Quantity, Category, Status }
  response.status(200).send(responseData);
});
module.exports = router;
