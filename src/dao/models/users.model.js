import mongoose from "mongoose";

export const userModel=mongoose.model(
    "users",
    new mongoose.Schema(
        {
            first_name: String,
            last_name:  String,
            email:      { type:String, require:true, unique:true },
            age:        Number,
            password:   String,
            role:        String, 
            idc:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'carts'
            }, 
        },
        {timestamps:true}
    )
)