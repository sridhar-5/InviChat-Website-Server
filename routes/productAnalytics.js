const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const productPurchase = require("../Models/productPurchase");
const _ = require("lodash");
const Product = require("../Models/productDetails");

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
    responseFormat.push({ type: key, sales: (value / totalValue) * 100 });
  }
  response.send(responseFormat);
});
module.exports = router;
