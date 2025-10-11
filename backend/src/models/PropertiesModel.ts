import { model, Schema } from "mongoose";

const propertiesSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    images: { type: [String], required: true },
    propertyType: { type: String, required: true, enum: ['hotel', 'villa', 'resort']}
}, {
    timestamps: true,
})

const PropertiesModel = model('properties', propertiesSchema);

export default PropertiesModel;