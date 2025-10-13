import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    role: { type: String, enum: ['admin', 'user'], default: 'user' }
}, {
    versionKey: false,
    timestamps: true,
})

const User = mongoose.model('User', userSchema);
export default User;