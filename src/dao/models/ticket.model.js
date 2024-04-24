import mongoose from "mongoose";
import shortid from 'shortid';

export const ticketModelo=mongoose.model(
    "tickets",
    new mongoose.Schema(
        {
            code: {
                type: String,
                required: true,
                unique: true,
                default: () => shortid.generate() // Devuelve directamente el código generado por shortid
            },
            purchase_datetime: {
                type: Date,
                default: Date.now,
                required: true
            },
            detail: [],
            amount: {
                type: Number,
                required: true
            },
            purchaser: {
                type: String,
                required: true
            }
        }, {timestamps:true}
    )
)