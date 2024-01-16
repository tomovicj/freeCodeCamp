"use strict";

require('dotenv').config()
const mongoose = require('mongoose');
const crypto = require('crypto');
const Stock = require("../models/Stock.js");


async function connectDB() {
  await mongoose.connect(process.env.DB);
}
connectDB().catch(err => console.log(err));


module.exports = function (app) {
  app.route("/api/stock-prices").get(async function (req, res) {
    let { stock, like } = req.query;
    stock = stock.toUpperCase();

    const price = await fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`)
      .then((response) => response.json())
      .then((data) => data.latestPrice)
      .catch((error) => {
        console.log(error);
        res.json({ error: "An error appeared while fetching the stock price" });
      });

    if (!price) {
      return res.json({ error: "No data for that stock" });
    }

    let stockDB = await Stock.findOne({ name: stock });
    // If no stock with that name is in DB, create one
    if (!stockDB) {
      stockDB = new Stock({ name: stock });
      await stockDB.save();
    }

    // If like is true and its first like for this stock, save it to DB
    if (like === "true") {
      const hashedIp = crypto.createHash('sha256').update(req.ip).digest('hex');
      if (!stockDB.likes.includes(hashedIp)) {
        stockDB.likes.push(hashedIp);
        await stockDB.save();
      }
    }

    return res.json({ stockData: { stock, price, likes: stockDB.likes.length } });
  });
};
