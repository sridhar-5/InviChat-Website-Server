const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Sellers = require("../Models/Seller.js");
const url = require("url");

router.get("/", async (request, response) => {
  const queryObject = url.parse(request.url, true).query;
  const { phone } = queryObject;
  const findSeller = await Sellers.find({ phone });
  if (findSeller) {
    response.status(200).send(findSeller);
  } else {
    response.status(404).send("Seller not found");
  }
});

module.exports = router;
