const mongoose = require("mongoose");
const Candidate = require("./models/Candidate");
require("dotenv").config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    await Candidate.deleteMany();
    await Candidate.insertMany([
      { name: "White Trần" },
      { name: "Mần Đang" },
      { name: "Michael Beos" },
    ]);
    console.log("✅ Đã thêm ứng viên mẫu");
    mongoose.disconnect();
  });
