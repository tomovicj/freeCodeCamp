import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import dns from "dns";
import Url from "./models/url.js";

const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

// Check if mongo url is provided
if (process.env["MONGO_URI"] == "") {
  console.log("Please provide mongo url to the .env file");
  process.exit(1);
}

mongoose.connect(process.env["MONGO_URI"], {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.get("/api/shorturl/:shortUrl", async (req, res) => {
  try {
    const url = await Url.findOne({ shortUrl: req.params.shortUrl }).exec();
    if (url) {
      return res.redirect(url.originalUrl);
    } else {
      return res.redirect("/");
    }
  } catch (error) {
    console.log(error);
    return res.json({ message: "An error occurred" });
  }
});

app.post("/api/shorturl", (req, res, next) => {
  // If url form is invalid
  if (!/^https?:\/\//gi.test(req.body.url)) {
    return res.json({ error: "invalid url" });
  }
  const url = new URL(req.body.url);
  // Validates the URL
  dns.lookup(url.hostname, (error) => {
    if (error) {
      return res.json({ error: "invalid url" });
    }
    next();
  });
});

app.post("/api/shorturl", async (req, res) => {
  let lastUrl;
  try {
    lastUrl = await Url.find({})
      .sort({ shortUrl: -1 })
      .limit(1)
      .select("shortUrl")
      .exec();
  } catch (error) {
    console.log(error);
    return res.json({ message: "An error occurred" });
  }
  let lastShortUrl;
  try {
    lastShortUrl = lastUrl[0].shortUrl;
  } catch {
    // If no lastShortUrl is found set it to 0
    lastShortUrl = 0;
  }
  const shortUrl = lastShortUrl + 1;
  let url;
  try {
    url = await Url.create({
      originalUrl: req.body.url,
      shortUrl: shortUrl,
    });
  } catch (error) {
    console.log(error);
    return res.json({ message: "An error occurred" });
  }

  res.json({
    original_url: url.originalUrl,
    short_url: url.shortUrl,
  });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
