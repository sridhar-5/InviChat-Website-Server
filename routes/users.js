const router = require("express").Router();
const mongoose = require("mongoose");
const endUserData = require("../Models/endUser");

router.get("/", async (request, response) => {
  try {
    let count = 0;
    const data = await endUserData.find({});
    var responseData = [];

    data.forEach((user) => {
      responseData.push({
        key: count++,
        name: user.Name,
        age: user.Age,
        phone: user.phone,
        email: user.email,
        preference_tags: user.preference_tags,
      });
    });
    response.json(responseData);
  } catch (error) {
    response.json({ message: error });
  }
});

router.patch("/:email", async (request, response) => {
  try {
    console.log(request.params.email);
    console.log(request.body);
    const updatedUser = await endUserData.updateOne(
      { email: request.params.email },
      {
        $set: {
          Name: request.body.name,
          phone: request.body.phone,
          email: request.body.email,
        },
      }
    );
    console.log(updatedUser);
    response.status(200).json(updatedUser);
  } catch (error) {
    response.json({ message: error });
  }
});

router.delete("/:email", async (request, response) => {
  try {
    const removedUser = await endUserData.remove({
      email: request.params.email,
    });
    response.status(200).json(removedUser);
  } catch (error) {
    response.json({ message: error });
  }
});

module.exports = router;
