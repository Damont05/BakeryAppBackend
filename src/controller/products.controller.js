import { TYPES_ERRORS } from '../utils/errors.js';
import { ProductService } from "../service/products.service.js";
import { logger } from '../utils/loggers.js';

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


            let newProduct = {code, title, description, price, stock, category, thumbnail, owner}
             
            await productService.m_addProduct_s(newProduct);

            res.status(201).json({ ok:true, message:'Product created', product:newProduct });

        } catch (e) {
            res.status(500).json({ error: e});
        }

    }

    static async getOneProduct(req, res) {
        
        try {
            let { id } = req.params;
+
            logger.debug("id: " , id)
            let product = await  productService.m_getProductOne_s(id);

            if(!product){
                res.setHeader('Content-Type', 'application/json');
                return res.status(500).json({"ok": false,error:`error inesperado en el server`})
            }
            
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({ ok:true, product});
            
        } catch (e) {
            res.status(500).json({ error: e});
        }
    }
    


    
}