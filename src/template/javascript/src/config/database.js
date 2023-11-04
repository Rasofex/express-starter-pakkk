import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const url = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/express-starter-pakkk';
        const conn = await mongoose.connect(url);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}