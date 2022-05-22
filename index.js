const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const products = require("./Models/productDetails");
var cors = require("cors");

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

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

  response.send(getAllTheProducts);
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`server started on ${PORT}`);
});
