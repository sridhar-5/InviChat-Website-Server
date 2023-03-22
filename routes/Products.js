const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const products = require("../Models/productDetails");
const _ = require("lodash");
const Product = require("../Models/productDetails");
let DateGenerator = require("random-date-generator");
const productPurchase = require("../Models/productPurchase");

router.get("/", async (request, response) => {
  const getAllTheProducts = await products.find({});
  if (process.env.NODE_ENV !== "production") {
    console.log(getAllTheProducts);
  }

  response.send(getAllTheProducts);
});

// create a new product
router.post("/", async (request, response) => {
  console.log(request.body);
  const {
    productName,
    productDescription,
    productPrice,
    productQuantity,
    productImages,
    Owner,
    Category,
    productId,
  } = request.body;
  const newProduct = new products({
    productName,
    productDescription,
    productPrice,
    productQuantity,
    productImages,
    Owner,
    Category,
    productId,
  });
  const product = await newProduct.save();
  response.status(201).send(product);
});

//edit product details
router.patch("/:id", async (request, response) => {
  const requestBody = request.body;
  const updateProduct = await products.findOneAndUpdate(
    { productId: request.params.id },
    requestBody,
    { new: true }
  );
  response.status(200).send(updateProduct);
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

router.post("/product-purchase", async (request, response) => {
  const { productId, quantity } = request.body;
  let startDate = new Date(2022, 4, 1);
  let endDate = new Date(2023, 3, 23);
  const product = await products.findOne({ productId });
  if (product.productQuantity < quantity) {
    response.status(400).send("Not enough quantity");
  }
  // product.productQuantity -= quantity;
  await product.save();
  const newProduct = new productPurchase({
    productId: productId,
    quantity: quantity,
    purchaseMonth: DateGenerator.getRandomDateInRange(startDate, endDate)
      .toDateString()
      .split(" ")[1],
    purchaseYear: DateGenerator.getRandomDateInRange(startDate, endDate)
      .toDateString()
      .split(" ")[3],
    productPrice: price,
  });
  await newProduct.save();
  response.send(product);
});

//tested for bulk product ingestion
router.post("/bulk-product-ingestion", async (request, response) => {
  const products = request.body.products;
  const parsedProducts = [];
  products.forEach((product) => {
    parsedProducts.push(
      _.pick(product, [
        "id",
        "category",
        "title",
        "price",
        "description",
        "image",
        "rating",
      ])
    );
  });

  console.log(parsedProducts);

  parsedProducts.forEach(async (product) => {
    const newProduct = new Product({
      productId: product.id,
      productName: product.title,
      productDescription: product.description,
      productPrice: product.price,
      productQuantity: product.rating.count,
      productImages: [product.image],
      Owner: "7569353633",
      Category: product.category,
    });
    await newProduct.save();
  });
  response.status(201).send("Products added successfully");
});

//tested for bulk product purchases ingestion
router.post("/bulk-product-purchases", async (request, response) => {
  const products = request.body.products;
  let startDate = new Date(2022, 4, 1);
  let endDate = new Date(2023, 3, 23);

  const parsedProducts = [];
  products.forEach((product) => {
    parsedProducts.push(_.pick(product, ["id", "rating", "price"]));
  });
  console.log(parsedProducts);
  parsedProducts.forEach(async (product) => {
    const newProduct = new productPurchase({
      productId: product.id,
      productPrice: product.price,
      quantity: product.rating.count - Math.floor(Math.random() * 100) + 1,
      purchaseMonth: DateGenerator.getRandomDateInRange(startDate, endDate)
        .toDateString()
        .split(" ")[1],
      purchaseYear: DateGenerator.getRandomDateInRange(startDate, endDate)
        .toDateString()
        .split(" ")[3],
    });
    await newProduct.save();
  });
  response.send("Products added successfully");
});

module.exports = router;
