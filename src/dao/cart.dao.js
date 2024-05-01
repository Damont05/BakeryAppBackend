import { cartModel } from './models/carts.model.js';
import { logger } from '../utils/loggers.js';

export class CartDAO {

    async create(){
        try {
            return await cartModel.create({productos:[]});
        } catch (e) {
            logger.error(e.message)
            return null;
        }
    }

    async getById(id){
        try {
            return await cartModel.findOne({_id:id}).populate("products.product").lean();
        } catch (e) {
            return null;
        }
    }

    async get(){
        try {
            return await cartModel.find().lean();
        } catch (e) {
            return null;
        }
    }

    async update(id, cart){
        try {
            return await cartModel.updateOne({_id:id}, cart)
        } catch (e) {
            return null
        }
    }

    async deleteAll(){
        try {
            return await cartModel.deleteMany({})
        } catch (e) {
            return null
        }
    }

    async deleteProductCart(idc,idp){
        try {
            
            let cart = await cartModel.findById(idc);

            let prod = cart.products.filter(item => item.product.toString() !== idp ); 
            return await cart.updateOne({ products : prod })
            
        } catch (e) {
         
            return false
        }
              
    }


    async deleteProductsCart(idc){
        try {
            
            let cart = await cartModel.findById(idc);

            let prod = cart.products.deleteAll();
            return await cart.updateOne({ products : prod })
            
        } catch (e) {
            return false
        }
              
    }


}