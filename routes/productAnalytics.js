const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const productDetails = require("../Models/productDetails");
const _ = require("lodash");
const Product = require("../Models/productDetails");
const productPurchase = require("../Models/productPurchase");

router.get("/income-analysis", async (request, response) => {
  const purchases = await productPurchase.find({});
  const sales = {};
  purchases.forEach((purchase) => {
    if (purchase.month in sales) {
      sales[purchase.purchaseMonth] += purchase.quantity;
    } else {
      sales[purchase.purchaseMonth] = purchase.quantity;
    }
  });

  const responseFormat = [];
  for (const [key, value] of Object.entries(sales)) {
    responseFormat.push({ type: key, sales: value });
  }
  response.send(responseFormat);
});

router.get("/income-analysis/getStatus", async (request, response) => {
  const now = new Date(); // Create a new Date object with the current date and time
  const currentMonth = now.toLocaleString("default", { month: "short" });
  now.setMonth(now.getMonth() - 1);
  const pastMonth = now.toLocaleString("default", { month: "short" });
  const purchases = await productPurchase.find({ purchaseMonth: currentMonth });
  const pastMonthPurchases = await productPurchase.find({
    purchaseMonth: pastMonth,
  });

  var totalIncomeThisMonth = 0;
  var totalIncomeLastMonth = 0;
  purchases.forEach((purchase) => {
    console.log(purchase);
    totalIncomeThisMonth += purchase.quantity * purchase.productPrice;
  });
  pastMonthPurchases.forEach((purchase) => {
    totalIncomeLastMonth += purchase.quantity * purchase.productPrice;
  });

  response.send({
    income: totalIncomeThisMonth,
    profit: totalIncomeThisMonth > totalIncomeLastMonth ? true : false,
    loss: totalIncomeThisMonth < totalIncomeLastMonth ? true : false,
    factor:
      (Math.abs(totalIncomeThisMonth - totalIncomeLastMonth) /
        totalIncomeLastMonth) *
      100,
  });
});

router.get("/average-income-analysis/getStatus", async (request, response) => {
  const now = new Date(); // Create a new Date object with the current date and time
  const currentMonth = now.toLocaleString("default", { month: "short" });
  now.setMonth(now.getMonth() - 1);
  const pastMonth = now.toLocaleString("default", { month: "short" });
  const purchases = await productPurchase.find({ purchaseMonth: currentMonth });
  const pastMonthPurchases = await productPurchase.find({
    purchaseMonth: pastMonth,
  });
  const monthDays = {
    Jan: 31,
    Feb: 28,
    Mar: 31,
    Apr: 30,
    May: 31,
    Jun: 30,
    Jul: 31,
    Aug: 31,
    Sep: 30,
    Oct: 31,
    Nov: 30,
    Dec: 31,
  };
  var totalIncomeThisMonth = 0;
  var totalIncomeLastMonth = 0;
  purchases.forEach((purchase) => {
    console.log(purchase);
    totalIncomeThisMonth += purchase.quantity * purchase.productPrice;
  });
  pastMonthPurchases.forEach((purchase) => {
    totalIncomeLastMonth += purchase.quantity * purchase.productPrice;
  });
  totalIncomeThisMonth = totalIncomeThisMonth / monthDays[currentMonth];
  totalIncomeLastMonth = totalIncomeLastMonth / monthDays[pastMonth];
  response.send({
    average_income: totalIncomeThisMonth / monthDays[currentMonth],
    profit: totalIncomeThisMonth > totalIncomeLastMonth ? true : false,
    loss: totalIncomeThisMonth < totalIncomeLastMonth ? true : false,
    factor:
      (Math.abs(totalIncomeThisMonth - totalIncomeLastMonth) /
        totalIncomeLastMonth) *
      100,
  });
});

router.get("/category-income-analysis", async (request, response) => {
  const purchases = await productPurchase.find({});
  const sales = {};
  for (const purchase of purchases) {
    const prod = await Product.find({ productId: purchase.productId });
    console.log(prod, purchase.productId);
    const prodCat = prod[0].Category;

    if (prodCat in sales) {
      sales[prodCat] += purchase.quantity;
    } else {
      sales[prodCat] = purchase.quantity;
    }
  }
  const responseFormat = [];
  var totalValue = 0;
  for (const [key, value] of Object.entries(sales)) {
    totalValue += value;
  }
  for (const [key, value] of Object.entries(sales)) {
    responseFormat.push({ type: key, value: (value / totalValue) * 100 });
  }
  response.send(responseFormat);
});

router.get("/category/product-analysis", async (request, response) => {
  const products = await productDetails.find({});
  const items = {};
  for (const product of products) {
    if (product.Category in items) {
      items[product.Category] += product.productQuantity;
    } else {
      items[product.Category] = product.productQuantity;
    }
  }
  const responseFormat = [];
  var totalValue = 0;
  for (const [key, value] of Object.entries(items)) {
    totalValue += value;
  }
  for (const [key, value] of Object.entries(items)) {
    responseFormat.push({ type: key, value: (value / totalValue) * 100 });
  }
  response.send(responseFormat);
});

router.get("/get-categories", async (request, response) => {
  var categories = new Set();
  const products = await productDetails.find({});
  for (const product of products) {
    categories.add(product.Category);
  }
  response.send(Array.from(categories));
});

router.get("/category-wise-growth-analysis", async (request, response) => {
  //get the category wise analysis for this month compared to last month give me the response on the form of a json [{category: growth percentage}]
  //get current month
  try {
    const now = new Date(); // Create a new Date object with the current date and time
    const currentMonth = now.toLocaleString("default", { month: "short" });
    now.setMonth(now.getMonth() - 1);
    const pastMonth = now.toLocaleString("default", { month: "short" });

    const purchases = await productPurchase.find({
      purchaseMonth: currentMonth,
    });
    const pastMonthPurchases = await productPurchase.find({
      purchaseMonth: pastMonth,
    });

    var categoryPurchasesThisMonth = {};
    for (const purchase of purchases) {
      const product = await Product.find({ productId: purchase.productId });
      const category = product[0].Category;

      if (category in categoryPurchasesThisMonth) {
        categoryPurchasesThisMonth[category] += purchase.quantity;
      } else {
        categoryPurchasesThisMonth[category] = purchase.quantity;
      }
    }

    var categoryPurchasesLastMonth = {};
    for (const purchase of pastMonthPurchases) {
      const product = await Product.find({ productId: purchase.productId });
      const category = product[0].Category;

      if (category in categoryPurchasesLastMonth) {
        categoryPurchasesLastMonth[category] += purchase.quantity;
      } else {
        categoryPurchasesLastMonth[category] = purchase.quantity;
      }
    }

    console.log(categoryPurchasesThisMonth, categoryPurchasesLastMonth);

    const responseFormat = [];

    for (const [category, quantity] of Object.entries(
      categoryPurchasesThisMonth
    )) {
      const lastMonthQuantity = categoryPurchasesLastMonth[category] || 0;
      const growthPercentage = lastMonthQuantity
        ? ((quantity - lastMonthQuantity) / lastMonthQuantity) * 100
        : 100;
      const roundedGrowth = parseFloat(growthPercentage.toFixed(2));
      responseFormat.push({
        category: category,
        growth: Math.abs(roundedGrowth / 100),
      });
    }

    for (const [category, quantity] of Object.entries(
      categoryPurchasesLastMonth
    )) {
      if (!(category in categoryPurchasesThisMonth)) {
        const growthPercentage = quantity ? -100 : 0;
        const roundedGrowth = parseFloat(growthPercentage.toFixed(2));
        responseFormat.push({
          category: category,
          growth: Math.abs(roundedGrowth / 100),
        });
      }
    }
    console.log(responseFormat);

    response.json(responseFormat);
  } catch (error) {
    response.status(500).send({ message: error.message });
  }
});

router.get(
  "/category-wise-growth-analysis/:category",
  async (request, response) => {
    const category = request.params.category;
    const database = {
      "men's clothing": 0.32,
      jewelery: 0.17,
      electronics: 0.65,
      "women's clothing": 0.48,
    };
    console.log(database[category]);
    response.json({ growth: database[category] });
  }
);

module.exports = router;
