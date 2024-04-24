import mongoose from "mongoose";

export const cartModel = mongoose.model(
    "carts",
    new mongoose.Schema(
        {
            products:[
                {
                    product: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "products"
                    }, 
                    quantity: Number
                }
            ]
        },
        {timestamps:true}
    )
)