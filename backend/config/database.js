const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // Options useNewUrlParser and useUnifiedTopology are deprecated in MongoDB driver 4.0+
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
