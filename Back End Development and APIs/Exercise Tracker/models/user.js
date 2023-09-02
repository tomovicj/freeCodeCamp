const mongoose = require("mongoose");
const { exerciseSchema } = require("./exercise.js");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  log: {
    type: [exerciseSchema],
    default: [],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = { User };
