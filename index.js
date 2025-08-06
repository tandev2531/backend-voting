const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const voteRoutes = require("./routes/vote");
const adminRoutes = require("./routes/admin");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/vote", voteRoutes);
app.use("/api/admin", adminRoutes);
app.get('/', (req, res) => {
  res.send('Voting API is running ✅');
});
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT, () => {
      console.log(
        `🚀 Server running on port ${process.env.PORT}`,
      );
    });
  })
  .catch((err) =>
    console.error(
      "❌ MongoDB connection error:",
      err,
    ),
  );
