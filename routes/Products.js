const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const products = require("../Models/productDetails");

router.get("/", async (request, response) => {
  const getAllTheProducts = await products.find({});
  if (process.env.NODE_ENV !== "production") {
    console.log(getAllTheProducts);
  }

  response.send(getAllTheProducts);
});

router.delete("/:id", async (request, response) => {
  const deleteProduct = await products.findOneAndDelete({
    productId: request.params.id,
  });
  if (process.env.NODE_ENV !== "production") {
    console.log(deleteProduct);
  }
  response.send(deleteProduct);
});

module.exports = router;
