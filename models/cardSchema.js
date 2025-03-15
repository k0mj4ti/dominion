import mongoose, { Schema, model, models } from "mongoose";

const cardSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    imagePath: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    choices: [{
        text: String,
        consequenceText: String,
        statChanges: [Number],
    }],
    addon: {
        type: String,
        default: null
    }
});

const Card = models.Card || model("Card", cardSchema);
export default Card;
