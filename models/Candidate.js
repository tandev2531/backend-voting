const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String, // nếu muốn hiển thị giới thiệu
});

module.exports = mongoose.model(
  "Candidate",
  candidateSchema,
);
