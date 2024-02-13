const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  option: { type: String },
  votes: { type: Number, default: 0 },
});

const pollSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  Question: { type: String, required: true },
  options: [optionSchema],
  votes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  created: { type: Date, default: Date.now },
});
const PollModel = mongoose.model("Poll", pollSchema);
module.exports=PollModel;
