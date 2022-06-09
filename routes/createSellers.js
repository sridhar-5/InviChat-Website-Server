const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const sellerModel = require("../Models/Seller.js");

router.post("/", async (request, response) => {
  console.log(request.body);
  console.log(request.body.name, request.body.email, request.body.phone);
  const { name, email, phone } = request.body;
  console.log(request.body);
  console.log(name, email, phone);
  const newSeller = new sellerModel({
    name,
    email,
    phone,
  });
  const status = await newSeller.save();
  if (process.env.NODE_ENV !== "production") {
    console.log(status);
  }
  response.status(201).send(status);
});

module.exports = router;
