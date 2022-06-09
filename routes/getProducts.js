const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const products = require("../Models/productDetails");


router.get("/", (request, response) => {
    const getAllTheProducts = await products.find({});
    if (process.env.NODE_ENV !== "production") {
      console.log(getAllTheProducts);
    }
  
    response.send(getAllTheProducts);
})

module.exports = router;