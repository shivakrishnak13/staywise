import User from "../models/User";
import { compare, hash } from "bcrypt";
import { config } from "dotenv";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/tokenUtil";

config();

export const createUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        const existUser = await User.findOne({ email });
        if (existUser) {
            res.status(200).json({ message: "user already registered. please login"});
            return;
        } else {
            const hashedPassword = await hash(password, 15);
            if (hashedPassword) {
                const newUser = new User({ name, email, password: hashedPassword });
                await newUser.save();
                const token = generateToken({ userId: newUser._id, role: newUser.role})

                res.status(200).json({ message: 'user created', token})
            } else {
                res.status(400).json({ message: "Something went wrong"})
            }
        }
    } catch (error: any) {
        res.status(400).json({error: error.message})
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            const comparePass = await compare(password, userExists.password);
            if (comparePass) {
                const token = generateToken({ userId: userExists._id, role: userExists.role });
                res.status(200).json({ message: "user logged in", token })
            } else {
                res.status(400).json({ message: "please check email or password"})
            }
        } else {
            res.status(400).json({ message: "please check email or password"})
        }
    } catch (error: any) {
        res.status(400).json({error: error.message})
    }
}

export const getUserDetails = async (req: Request, res: Response) => {
    const { userId } = (req as any).user;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error: any) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

