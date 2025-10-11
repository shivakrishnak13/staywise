import { Request, Response } from "express";
import BookingsModel from "../models/bookingsModel";
import PropertiesModel from "../models/PropertiesModel";

const getBookings = async (req: Request, res: Response) => {
    const { userId } = (req as any).user;
    try {
        const allBookings = await BookingsModel.find({ userId })
        res.status(200).json({ bookings: allBookings })
        
    } catch (error: any) {
        res.status(500).json({ message: "Internal Server Error", error: error.message})
    }
};

const createBooking = async (req: Request, res: Response) => {
    const { userId } = (req as any).user
    const { startDate, endDate, propertyId } = req.body;
    try {
        const selectedProperty = await PropertiesModel.findOne({ _id: propertyId })
        const totalDays = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24));
        if (selectedProperty) {
            const totalPrice = totalDays * selectedProperty?.price;
            const createBooking = await BookingsModel.create({
                userId,
                startDate,
                endDate,
                propertyId,
                totalPrice
            });
            res.status(201).json({ message: "Booking created successfully", booking: createBooking });
        }
    } catch (error: any) {
        res.status(500).json({ message: "Internal Server Error", error: error.message})
    }
}

export { getBookings, createBooking }