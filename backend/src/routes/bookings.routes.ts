import { Router } from "express";
import { cancelBooking, createBooking, getAllBookingsForAdmin, getBookings } from "../controllers/bookingsController";

const bookingsRouter = Router();

bookingsRouter.get('/', getBookings);
bookingsRouter.post('/', createBooking);
bookingsRouter.delete('/cancel/:bookingId', cancelBooking);
bookingsRouter.get('/admin', getAllBookingsForAdmin);

export default bookingsRouter;