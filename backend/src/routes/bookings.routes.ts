import { Router } from "express";
import { createBooking, getBookings } from "../controllers/bookingsController";

const bookingsRouter = Router();

bookingsRouter.get('/', getBookings);
bookingsRouter.post('/', createBooking);

export default bookingsRouter;