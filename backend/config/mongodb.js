import mongoose from "mongoose";

const connectDB = async () => {

    console.log("ENV:", process.env.MONGODB_URI)

    mongoose.connection.on('connected', () => {
        console.log("Database Connected")
    })

    await mongoose.connect(process.env.MONGODB_URI)
}

export default connectDB