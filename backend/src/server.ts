import express from "express";
import { connectDB } from "./configs/db";
import authRouter from "./routes/auth.routes";

const app = express();
app.use(express.json())

app.use('/user', authRouter)

const PORT = process.env.DEFAULT_PORT || 8080;


connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("server is running")
    })
})