import { config } from "dotenv";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongoose";
config();

const SECRET_KEY = process.env.JWT_SECRET || 'staywise';

export const generateToken = (payload: object) => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '2d' })
}
export const verifyToken = (token: string) => {
    return jwt.verify(token, SECRET_KEY)
}