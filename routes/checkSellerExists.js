const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Sellers = require("../Models/Seller.js");

router.get("/:phone", async (request, response) => {
  const { phone } = request.params;
  const findSeller = await Sellers.find({ phone });
  if (findSeller) {
    response.status(200).send(findSeller);
  } else {
    response.status(404).send("Seller not found");
  }
});

module.exports = router;
