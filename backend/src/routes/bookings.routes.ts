import { Router } from "express";
import { cancelBooking, createBooking, getBookings } from "../controllers/bookingsController";

const bookingsRouter = Router();

bookingsRouter.get('/', getBookings);
bookingsRouter.post('/', createBooking);
bookingsRouter.post('/cancel/:bookingId', cancelBooking);

export default bookingsRouter;