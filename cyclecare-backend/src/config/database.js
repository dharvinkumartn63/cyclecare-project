const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cyclecare');
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`⚠️ MongoDB Connection Error: ${error.message}`);
    console.log('🔄 Retrying MongoDB connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

module.exports = connectDB;
