import cors from 'cors';
import express from "express";
import { connectDB } from "./configs/db";
import authRouter from "./routes/auth.routes";
import propertiesRouter from "./routes/properties.routes";
import { authenticate } from "./middlewares/authMiddleware";
import bookingsRouter from './routes/bookings.routes';

const app = express();
app.use(cors())
app.use(express.json())

app.use('/api/user', authRouter)
app.use('/api/properties', authenticate, propertiesRouter)
app.use('/api/bookings', authenticate, bookingsRouter);

const PORT = process.env.DEFAULT_PORT || 8080;


connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("server is running")
    })
})