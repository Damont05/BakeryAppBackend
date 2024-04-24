import { Router } from 'express';
import {productsController} from '../controller/products.controller.js'
//import { auth,authAdmin,authUser } from "../utils/utils.js";
export const router=Router()

//routes (/api/products)
router.get("/products",  productsController.getProducts);
router.post("/products", productsController.postProduct);



