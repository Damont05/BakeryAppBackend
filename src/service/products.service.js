import { productDAO } from "../dao/products.dao.js";
import {logger} from "../utils/loggers.js";

export class ProductService {

    async m_addProduct_s(productData) {
        try {

            const newProduct = await productDAO.create(productData)

            return newProduct;

        } catch (e) {
            logger.error(`Error m_addProduct_s: ` , e)
        }
    }

    async m_getProduct_s(){
        try {
            const products = await productDAO.get();
            return products;
        } catch (e) {
            logger.error(`Error m_getProduct_s: ` , e)
        }
    }

    async m_getProductOne_s(id){
        try {
            const product = await productDAO.getOne(id);
            return product;
        } catch (e) {
            logger.error(`Error m_getProduct_s: ` , e)
        }
    }

    async m_getProductCode_s(code){
        try {
            const products = await productDAO.getProductCode(code);
            return products;
        } catch (e) {
            logger.error(`Error m_getProductCode_s: ` , e)
        }
    }

    async updateProductQuantities(cart) {
        try {

            let noStock=[]
            let productsStock=[]
    
            
            for (const product of cart.products) {
                const productId = product.product._id;
                const quantity = product.quantity;
        
                // Get the existing product from the database
                const existingProduct = await productDAO.getProduct(productId);
                
                if (existingProduct) {
                    //Subtract the quantity from the existing stock
                    let updatedStock = existingProduct.stock - quantity;
                    
                    //si no hay stock agregamos producto a nostock
                    if (updatedStock<0){
                        noStock.push(product)
                        updatedStock = existingProduct.stock
                        logger.info(noStock)
                    }else{
                        productsStock.push(product)
                    }
                    //Update the stock in the database
                    const updated = await productDAO.update(productId, { stock: updatedStock });
                    
                    if (!updated) {
                        logger.info(`Product with ID ${productId} not found or not updated.`);
                    }
                    
                } else {
                    logger.info(`Product with ID ${productId} not found in the database.`);
                }
            }
          
          return { noStock: noStock, productsStock: productsStock }
        } catch (error) {
            logger.error("Error updating product quantities:", error);
            // Handle the error as needed
        }
    }
    
}