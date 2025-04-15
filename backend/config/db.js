import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        // console.log("MONGO_URI:", process.env.MONGO_URI); // Debugging output
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(error.message);
        process.exit(1); // code 1: failure, 0: success
    }
}