const router = require("express").Router();
const mongoose = require("mongoose");
const sellerModel = require("../Models/Seller.js");

router.get("/", async (request, response) => {
  try {
    let count = 0;
    const data = await sellerModel.find({});
    var responseData = [];

    data.forEach((seller) => {
      responseData.push({
        key: count++,
        name: seller.name,
        phone: seller.phone,
        email: seller.email,
      });
    });
    console.log(responseData);
    response.json(responseData);
  } catch (error) {
    response.json({ message: error.message });
  }
});

router.patch("/:phone", async (request, response) => {
  try {
    console.log(request.params.email);
    console.log(request.body);
    const updatedUser = await sellerModel.updateOne(
      { phone: request.params.phone },
      {
        $set: request.body,
      }
    );
    console.log(updatedUser);
    response.status(200).json(updatedUser);
  } catch (error) {
    response.json({ message: error });
  }
});

router.delete("/:phone", async (request, response) => {
  try {
    const removedUser = await sellerModel.deleteOne({
      phone: request.params.phone,
    });
    response.status(200).json(removedUser);
  } catch (error) {
    response.json({ message: error });
  }
});

module.exports = router;
