import mongoose, { Schema, model, models } from "mongoose"

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    currentStats: {
        type: {
            food: Number,
            drink: Number,
            mental: Number,
            health: Number
        },
        required: true,
        default: { food: 50, drink: 50, mental: 50, health: 50 }
    },
    daysSurvived: {
        type: Number,
        required: true,
        default: 0
    }
}, {timestamps: true});

const User = models.User || model("User", userSchema)
export default User;