import mongoose from "mongoose";

export const productModel = mongoose.model(
    "products",
    new  mongoose.Schema(
        {
            code:           { type:String, require:true, unique:true },
            title:          { type:String, require:true },
            description:    { type:String, require:false },
            price:          { type:Number, require:true },
            status:         { type:Boolean,require:false },
            stock:          { type:Number, require:true },
            category:       { type:String, require:true },
            thumbnail:      { type:String, require:true },
            owner:          { type:String},
        },
        {timestamps:true}
    )
)


