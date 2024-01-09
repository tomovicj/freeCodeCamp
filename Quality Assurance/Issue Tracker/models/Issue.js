const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  issue_title: {
    type: String,
    required: true,
  },
  issue_text: {
    type: String,
    required: true,
  },
  created_by: {
    type: String,
    required: true,
  },
  assigned_to: {
    type: String,
    required: false,
  },
  status_text: {
    type: String,
    required: false,
  },
  created_on: {
    type: Date,
    required: true,
    default: () => new Date(),
  },
  updated_on: {
    type: Date,
    required: true,
    default: () => new Date(),
  },
  open: {
    type: Boolean,
    required: true,
    default: true,
  },
});

const Issue = mongoose.model("Issue", issueSchema);

module.exports = { issueSchema, Issue };
