const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: () => new Date(),
  },
});

const Exercise = mongoose.model("exercise", exerciseSchema);

module.exports = { exerciseSchema, Exercise };
