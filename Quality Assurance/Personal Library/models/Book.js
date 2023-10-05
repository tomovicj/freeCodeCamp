const { Schema, model } = require("mongoose");

const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  comments: {
    type: [],
    required: true,
    default: [],
  },
});

const Book = model("Book", bookSchema);

module.exports = { Book };
