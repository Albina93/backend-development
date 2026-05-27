const mongoose = require("mongoose");

function connectDB() {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => {
      console.error("MongoDB connection error: ", error);
      process.exit(1);
    });
}

module.exports = connectDB;
