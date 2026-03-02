require("dotenv").config();
const mongoose = require("mongoose");
const { app } = require("./app.js");

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/SFE-RS";

app.listen(PORT, async () => {
  await mongoose
    .connect(MONGODB_URI)
    .then(() => console.log(`Listening on port ${PORT} ...`))
    .catch((err) => console.error("MongoDB connection error:", err));
});
