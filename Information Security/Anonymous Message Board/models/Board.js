const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  threads: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Thread",
      }
    ],
    required: true,
    default: [],
  },
});

const Board = mongoose.model("Board", boardSchema);

module.exports = Board;
