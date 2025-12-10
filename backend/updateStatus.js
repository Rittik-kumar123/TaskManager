require("dotenv").config();
const mongoose = require("mongoose");
const Task = require("./models/Task");

async function fixStatus() {
  await mongoose.connect(process.env.MONGO_URI);

  const res = await Task.updateMany(
    { status: "Complete" },
    { $set: { status: "Completed" } }
  );

  console.log("Updated:", res);
  mongoose.disconnect();
}

fixStatus();
