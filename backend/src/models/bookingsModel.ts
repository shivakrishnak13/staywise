import mongoose from "mongoose";

const bookingsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'properties', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, required: true, enum: ['confirmed', 'canceled'], default: 'confirmed' },
    totalPrice: { type: Number, required: true }
}, {
    timestamps: true,
    versionKey: false,
})

const BookingsModel = mongoose.model('bookings', bookingsSchema);

export default BookingsModel;