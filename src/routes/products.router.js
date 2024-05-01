import { Router } from 'express';
import {productsController} from '../controller/products.controller.js'
export const router=Router()

//routes (/api/products)
router.get("/",  productsController.getProducts);
router.post("/", productsController.postProduct);
router.get("/:id", productsController.getOneProduct);




