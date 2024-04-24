import { TYPES_ERRORS } from '../utils/errors.js';
import { ProductService } from "../service/products.service.js";

const productService= new ProductService();


export class productsController {

    static async getProducts(req, res) {
        
        try {
            let products = await  productService.m_getProduct_s();

            if(!products){
                res.setHeader('Content-Type', 'application/json');
                return res.status(500).json({"ok": false,error:`error inesperado en el server`})
            }
            
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({ ok:true, products });
            
        } catch (e) {
            res.status(500).json({ error: e});
            console.log(e)
        }
    }

    static async postProduct(req, res) {
        try {

            //const profile = req.session.user.rol

            let { code, title, description, price, stock, category, thumbnail,owner } = req.body;

            if(!code||!title||!description||!price||!stock||!category){
                res .setHeader('Content-Type', 'application/json');
                return res.status(400).json({ ok:false, error: `fields are required` })
            }

            let productsExist =  await productService.m_getProductCode_s(code)
                    
            if (productsExist != null){
                 res.setHeader('Content-Type', 'application/json');
                 return res.status(400).json({ ok:false, error: `El codigo de producto ' ${code} ' ya existe en BD` })
            }

            //if (owner === 'admin') {
            // console.log('owner: ', owner)

            let newProduct = {code, title, description, price, stock, category, thumbnail, owner}
             
            console.log("newProduct: " , newProduct);
            await productService.m_addProduct_s(newProduct);

            res.status(201).json({ ok:true, message:'Product created', product:newProduct });

        } catch (e) {
            res.status(500).json({ error: e});
            console.log(e)
        }

    }


    
}