const mongoose = require("mongoose");

const threadSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  delete_password: {
    type: String,
    required: true,
  },
  created_on: {
    type: Date,
    required: true,
    default: new Date(),
  },
  bumped_on: {
    type: Date,
    required: true,
    default: new Date(),
  },
  reported: {
    type: Boolean,
    required: true,
    default: false,
  },
  replies: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reply",
      }
    ],
    required: true,
    default: [],
  },
});

const Thread = mongoose.model("Thread", threadSchema);

module.exports = Thread;
