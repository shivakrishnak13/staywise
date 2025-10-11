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