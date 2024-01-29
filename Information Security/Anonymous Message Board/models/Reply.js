const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  created_on: {
    type: Date,
    required: true,
    default: new Date(),
  },
  delete_password: {
    type: String,
    required: true,
  },
  reported: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const Reply = mongoose.model("Reply", replySchema);

module.exports = Reply;
