import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`Connected to MONGO_DB - ${conn.connection.host}`)
    } catch (error) {
        console.log(`Error occurred in database connection , ${error}`)
    }
}