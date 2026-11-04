const mongoose = require('mongoose');

async function connectDB() {
    const uri = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/mern_lab6';
    try {
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection failed. Start your local MongoDB server and check MONGODB_URL.');
        process.exit(1);
    }
}

module.exports = connectDB;
