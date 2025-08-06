const express = require("express");
const router = express.Router();
const Vote = require("../models/Vote");
const Candidate = require("../models/Candidate");
const ExcelJS = require("exceljs");
require("dotenv").config();

// Đăng nhập admin
router.post("/login", (req, res) => {
  const { secret } = req.body;

  if (secret === process.env.ADMIN_SECRET) {
    res.json({ success: true });
  } else {
    res
      .status(401)
      .json({
        success: false,
        message: "Sai mã bí mật",
      });
  }
});

// Thống kê và danh sách ai đã bầu
router.get("/stats", async (req, res) => {
  try {
    const candidates = await Candidate.find();
    const votes = await Vote.find().populate(
      "candidateId",
    );

    const result = candidates.map((c) => {
      const count = votes.filter(
        (v) =>
          v.candidateId._id.toString() ===
          c._id.toString(),
      ).length;
      return { name: c.name, votes: count };
    });

    const voters = votes.map((v) => ({
      voterName: v.voterName,
      candidateName: v.candidateId.name,
      time: v.createdAt,
    }));

    res.json({ result, voters });
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Lỗi server",
        error: err.message,
      });
  }
});

// Xuất file Excel
router.get("/export", async (req, res) => {
  try {
    const votes = await Vote.find().populate(
      "candidateId",
    );

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Votes");

    sheet.columns = [
      {
        header: "Tên người bầu",
        key: "voterName",
        width: 30,
      },
      {
        header: "Ứng viên",
        key: "candidateName",
        width: 30,
      },
      {
        header: "Thời gian",
        key: "time",
        width: 30,
      },
    ];

    votes.forEach((v) => {
      sheet.addRow({
        voterName: v.voterName,
        candidateName: v.candidateId.name,
        time: v.createdAt.toLocaleString(),
      });
    });

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="votes.xlsx"',
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Lỗi export",
        error: err.message,
      });
  }
});

module.exports = router;
