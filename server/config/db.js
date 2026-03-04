const mongoose = require("mongoose");

let cached = null;

const connectDB = async () => {
  if (cached) return cached;

  try {
    cached = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${cached.connection.host}`);
    return cached;
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
