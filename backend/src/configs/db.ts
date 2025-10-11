import { config } from "dotenv"
import mongoose from "mongoose"

config();

const CONNECTION_URL = process.env.MONGOOSE_URL || ''
export const connectDB = async () => {
    try {
        await mongoose.connect(CONNECTION_URL)
    } catch (error) {
        console.log('Something went wrong while connecting DB', error)
        throw error
    }
}

