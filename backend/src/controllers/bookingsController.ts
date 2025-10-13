import { Request, Response } from "express";
import BookingsModel from "../models/bookingsModel";
import PropertiesModel from "../models/PropertiesModel";
import User from "../models/User";

const getBookings = async (req: Request, res: Response) => {
    const { userId } = (req as any).user;
    try {
        const allBookings = await BookingsModel.find({ userId });
        const bookingsWithPropertyDetails = await Promise.all(
            allBookings.map(async (booking: any) => {
                const property = await PropertiesModel.findOne({ _id: booking.propertyId });
                return {
                    ...booking.toObject(),
                    propertyDetails: property ? property.toObject() : null
                };
            })
        );
        res.status(200).json({ bookings: bookingsWithPropertyDetails });
    } catch (error: any) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const createBooking = async (req: Request, res: Response) => {
    const { userId } = (req as any).user
    const { startDate, endDate, propertyId } = req.body;
    try {
        if (new Date(startDate) >= new Date(endDate)) {
            res.status(400).json({ message: "End date must be greater than start date" });
            return;
        }
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
};

const cancelBooking = async (req: Request, res: Response) => {
    const { bookingId } = req.params;
    const { userId } = (req as any).user;
    try {
        const booking = await BookingsModel.findOne({ _id: bookingId, userId });
        if (!booking) {
            res.status(404).json({ message: "Booking not found" });
            return;
        }
        await BookingsModel.updateOne({ _id: bookingId }, { status: 'canceled' });
        res.status(200).json({ message: "Booking cancelled successfully" });
    } catch (error: any) {
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}


const getAllBookingsForAdmin = async (req: Request, res: Response) => {
    const { role } = (req as any).user;
    if (role !== 'admin') {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
    try {
        const allBookings = await BookingsModel.find();
        const bookingsWithDetails = await Promise.all(
            allBookings.map(async (booking: any) => {
                const user = await User.findOne({ _id: booking.userId });
                const property = await PropertiesModel.findOne({ _id: booking.propertyId });
                return {
                    ...booking.toObject(),
                    userDetails: user
                        ? {
                            _id: user._id,
                            name: user.name,
                            email: user.email
                        }
                        : undefined,
                    propertyDetails: property
                        ? {
                            _id: property._id,
                            title: property.title,
                            description: property.description,
                            location: property.location,
                            price: property.price,
                            images: property.images,
                            propertyType: property.propertyType
                        }
                        : null
                };
            })
        );
        res.status(200).json({ bookings: bookingsWithDetails });
    } catch (error: any) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export { getBookings, createBooking, cancelBooking, getAllBookingsForAdmin };