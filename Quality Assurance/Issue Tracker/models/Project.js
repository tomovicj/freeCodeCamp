const mongoose = require("mongoose");
const { issueSchema } = require("./Issue.js");

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  issues: {
    type: [issueSchema],
    required: true,
    default: [],
  },
});

const Project = mongoose.model("Project", projectSchema);

module.exports = { Project };
