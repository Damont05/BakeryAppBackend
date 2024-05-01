import { productModel } from "./models/products.model.js";
import { logger } from "../utils/loggers.js";

export class productDAO {

    static async create(productObj) {
        try {
            return productModel.create(productObj);
        } catch (e) {
            logger.error(e);
        }
    }
    
    static async get(){

        try {

            let products = await productModel.find().lean();
            return products;

        } catch (error) {
            logger.error(e);
        }
    }

    static async getOne(id){

        try {

            let product = await productModel.findOne({_id:id}).lean();
            return product;

        } catch (error) {
            logger.error(e);
        }
    }

    static async getProductCode(code){
        try {
            let products = await productModel.findOne( {code}).lean();
            return products;

        } catch (e) {
            logger.error(e);
        }
    }

    static async updateQuantity(cart){
        try {
            let products = await productModel.find(cart);
            return products;

        } catch (e) {
            logger.error(e);
        }
    }

    static async getProduct(id){
        let product = productModel.findOne({_id:id})
           .limit(1)
           .lean();
        return product;
    }

    static async update(id,updatedFields){
        return  productModel.updateOne(
           { _id: id },
           { $set: updatedFields })
       }
   
    
}