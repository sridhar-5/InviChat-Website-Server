const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const products = require("./Models/productDetails");

function connectDatabase() {
  const DatabaseConnection = mongoose.connect(
    `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@sihhack.0ea71.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  );

  DatabaseConnection.then(() => {
    console.log("Connection to the database successfully");
  });
  DatabaseConnection.catch((error) => {
    console.log(`Connection Refused...${error}`);
  });
}

connectDatabase();

app.use(express.json());

app.get("/", async (request, response) => {
  const getAllTheProducts = await products.find({});
  if (process.env.NODE_ENV !== "production") {
    console.log(getAllTheProducts);
  }
  response.writeHead(200, {
    "Content-Type": "text/plain",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
  });

  response.status(200).send(getAllTheProducts);
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`server started on ${PORT}`);
});
