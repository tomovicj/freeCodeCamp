const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { User } = require("./models/user.js");
const { Exercise } = require("./models/exercise.js");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies

app.use(cors());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// Get all users
app.get("/api/users", async (req, res) => {
  const users = await User.find({}).select(["_id", "username"]).exec();
  res.json(users);
});

// Create a user
app.post("/api/users", (req, res) => {
  const newUser = new User({ username: req.body.username });
  newUser.save().catch((error) => {
    return res.json({ error: "Username is taken" });
  });
  res.json({
    username: newUser.username,
    _id: newUser._id,
  });
});

// Add exercise to a user
app.post("/api/users/:_id/exercises", async (req, res) => {
  const user = await User.findById(req.params._id);
  if (!user) return res.json({ error: "No user with that id" });
  const newExercise = new Exercise({
    description: req.body.description,
    duration: Number(req.body.duration),
    date: req.body.date ? new Date(req.body.date) : undefined,
  });
  const error = newExercise.validateSync();
  if (error) return res.json({ error: "Invalid data type" });
  user.log.push(newExercise);
  user.save();

  res.json({
    _id: user._id,
    username: user.username,
    description: newExercise.description,
    duration: newExercise.duration,
    date: newExercise.date.toDateString(),
  });
});

app.get("/api/users/:_id/logs", async (req, res) => {
  const { from, to, limit } = req.query;

  // Convert query parameters to Date objects or undefined
  const fromDate = from ? new Date(from) : undefined;
  const toDate = to ? new Date(to) : undefined;
  const limitValue = limit ? parseInt(limit) : undefined;

  try {
    const user = await User.aggregate([
      // Stage 1: Match documents with the provided _id
      { $match: { _id: new mongoose.Types.ObjectId(req.params._id) } },

      // Stage 2: Deconstruct the log array
      { $unwind: "$log" },

      // Stage 3: Filter logs based on date range
      {
        $match: {
          $and: [
            // Check if log.date is greater than or equal to fromDate
            { "log.date": { $gte: fromDate || new Date(0) } },

            // Check if log.date is less than or equal to toDate
            { "log.date": { $lte: toDate || new Date() } },
          ],
        },
      },

      // Stage 4: Sort logs by date in descending order
      { $sort: { "log.date": -1 } },

      // Stage 5: Group documents to perform aggregation operations
      {
        $group: {
          _id: "$_id", // Group by user _id
          username: { $first: "$username" }, // Get the first username
          count: { $sum: 1 }, // Count the number of documents in the group
          log: { $push: "$log" }, // Collect log entries into an array
        },
      },

      // Stage 6: Reshape the output document
      {
        $project: {
          _id: 1, // Include _id field
          username: 1, // Include username field
          count: 1, // Include count field
          // Conditionally include log field based on limitValue
          log: limitValue ? { $slice: ["$log", 0, limitValue] } : "$log",
        },
      },
    ]);

    if (user.length === 0) {
      return res.json({ error: "No user with that id" });
    }

    // Format the date fields in the log entries to "Mon Jan 01 1990" format
    const formattedLogs = user[0].log.map((logEntry) => ({
      ...logEntry,
      date: logEntry.date.toDateString(),
    }));

    res.json({
      _id: user[0]._id,
      username: user[0].username,
      count: user[0].count,
      log: formattedLogs,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
