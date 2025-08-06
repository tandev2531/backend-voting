const express = require("express");
const router = express.Router();
const Vote = require("../models/Vote");
const Candidate = require("../models/Candidate");

// Gửi phiếu bầu
router.post("/", async (req, res) => {
  const { voterName, candidateId } = req.body;

  try {
    // Kiểm tra đã bầu chưa
    const existingVote = await Vote.findOne({
      voterName,
    });
    if (existingVote) {
      return res
        .status(400)
        .json({ message: "Bạn đã bầu rồi!" });
    }

    // Tạo phiếu bầu
    const vote = new Vote({
      voterName,
      candidateId,
    });
    await vote.save();

    res
      .status(201)
      .json({ message: "Bầu thành công!" });
  } catch (err) {
    res.status(500).json({
      message: "Lỗi server",
      error: err.message,
    });
  }
});

// Lấy danh sách ứng viên và số phiếu
router.get("/results", async (req, res) => {
  try {
    const candidates = await Candidate.find();
    const votes = await Vote.find();

    const results = candidates.map((c) => {
      const count = votes.filter(
        (v) =>
          v.candidateId.toString() ===
          c._id.toString(),
      ).length;
      return {
        id: c._id,
        name: c.name,
        votes: count,
      };
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({
      message: "Lỗi server",
      error: err.message,
    });
  }
});

module.exports = router;
