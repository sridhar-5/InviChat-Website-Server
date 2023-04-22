const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ProductPurchaseModel = require("../Models/productPurchase");
const ProductModel = require("../Models/productDetails");

router.get("/", async (request, response) => {
  const purchases = await ProductPurchaseModel.find({});
  //find the product name by sending a request to the product service
  console.log(purchases);
  const responseData = [];
  var count = 1;
  for (const purchase of purchases) {
    const prod = await ProductModel.find({ productId: purchase.productId });
    console.log(prod, purchase);
    responseData.push({
      key: count++,
      _id: purchase._id,
      name: prod[0].productName,
      quantity: purchase.quantity,
      category: [prod[0].Category],
      status: [purchase.status],
    });
  }

  //sending back shape of { Name, Quantity, Category, Status }
  response.status(200).send(responseData);
});

router.patch("/:id", async (request, response) => {
  const { status } = request.body;
  const { id } = request.params;
  const purchase = await ProductPurchaseModel.updateOne(
    { _id: id },
    { $set: { status: status } }
  );
  response.status(200).send(purchase);
});

router.delete("/:id", async (request, response) => {
  const { id } = request.params;
  const deleteOrder = await ProductPurchaseModel.deleteOne({ _id: id });
  response.status(200).send(deleteOrder);
});

module.exports = router;
