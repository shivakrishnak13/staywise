const mongoose = require("mongoose");
require("dotenv").config();

const CONNECTION_URL = process.env.MONGOOSE_URL

const connectDB = async () => {
    try {
        await mongoose.connect(CONNECTION_URL)
    } catch (error) {
        console.log('Something went wrong while connecting DB', error)
        throw error
    }
}

module.exports = connectDB;