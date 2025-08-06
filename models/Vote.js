const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  voterName: {
    type: String,
    required: true,
    unique: true,
  }, // tên người bầu
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Candidate",
    required: true,
  }, // ID ứng viên
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model(
  "Vote",
  voteSchema,
);
