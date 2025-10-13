import cors from 'cors';
import express from "express";
import { connectDB } from "./configs/db";
import authRouter from "./routes/auth.routes";
import propertiesRouter from "./routes/properties.routes";
import { authenticate } from "./middlewares/authMiddleware";
import bookingsRouter from './routes/bookings.routes';

connectDB()
const app = express();
app.use(cors({
    origin: [
        'https://staywise-delta.vercel.app',
        'http://localhost:3000'
    ],
    credentials: true
}));

app.use(express.json())

app.get('/', (req, res) => {
    res.json({ message: "Welcome to StayWise Backend"})
})

app.use('/api/user', authRouter)
app.use('/api/properties', authenticate, propertiesRouter)
app.use('/api/bookings', authenticate, bookingsRouter);

const PORT = process.env.DEFAULT_PORT || 8080;

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.DEFAULT_PORT || 8080;
    
    
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running locally on http://localhost:${PORT}`);
        })
    }).catch(err => {
        console.error("Failed to connect to DB and start local server:", err);
    });
}

export default app;