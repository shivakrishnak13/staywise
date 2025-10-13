import { Request, Response } from "express";
import PropertiesModel from "../models/PropertiesModel";

export const getAllProperties = async (req: Request, res: Response) => {
     try {
        const allProperties = await PropertiesModel.find();
        res.status(200).json({ properties: allProperties })
        
     } catch (error: any) {
        res.status(500).json({ message: "Internal Server Error", error: error.message})
     }
};

export const getPropertyById = async (req: Request, res: Response) => {
    try {
        const property = await PropertiesModel.findById(req.params.id);

        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }

        res.status(200).json(property);

    } catch (error: any) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid property ID format" });
        }
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};