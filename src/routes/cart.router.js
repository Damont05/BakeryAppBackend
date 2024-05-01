import { Router } from 'express';
import { addProductCart, getCartById,m_delProdCart,m_add_res_cant, m_delProductsCart,getCarts} from '../controller/cart.controller.js';
import { passportView } from '../utils/utils.js';
export const router=Router();


router.get('/:idc', getCartById);

router.get('/', getCarts);

router.post("/:idc/product/:idp",  addProductCart);


router.delete("/:idc/prod/:idp", m_delProdCart);

router.delete("/products/cart/:idc", m_delProductsCart);


router.post("/:idc/product/:idp/op/:op", m_add_res_cant);

