const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const products = require("./Models/productDetails");
var cors = require("cors");

const postSellers = require("./routes/createSellers.js");
const findSeller = require("./routes/checkSellerExists.js");
const findProd = require("./routes/Products.js");
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

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
app.use("/api/createSeller", postSellers);
app.use("/api/checkSellerExists", findSeller);
app.use("/products", findProd);
app.use("/product/analytics", require("./routes/productAnalytics.js"));
app.use("/api/v1/sales", require("./routes/orders.js"));
app.use("/api/v1/users", require("./routes/users.js"));
app.use("/api/v1/sellers", require("./routes/sellers.js"));
app.use(express.json());

app.get("/", async (request, response) => {
  response.send("Hello..! Welcome to the demo server of Invichat Website");
});

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log(`server started on ${PORT}`);
});
