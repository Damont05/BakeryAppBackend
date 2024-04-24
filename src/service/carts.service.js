import { CartDAO } from '../dao/cart.dao.js';
import { logger } from '../utils/loggers.js';
import { CustomError,TYPES_ERRORS } from '../utils/errors.js';

const cartDAO = new  CartDAO();

export class CartService {

    async m_addCart_s() {
        try {
            const newCart = await cartDAO.create();
            return newCart;
        } catch (e) {
            logger.error(`Error m_addProduct_s: ` , e)
        }
    }

    async m_getById_s(id){ 
        try {
            return await cartDAO.getById(id);
        } catch (e) {
            throw new CustomError("Error CartDAO", e.message, e.codigo?e.codigo:TYPES_ERRORS.DATABASE, e.descrip
            ?e.descrip:"Unexpected error, contact your administrator");
        }
    }

    async m_update(id, cart){
        try {
            return await cartDAO.update(id,cart);
        } catch (e) {
            logger.error(e.message)
            return null
        }
    }

    async m_deleteAll(){
        try {
            return await cartDAO.deleteAll();
        } catch (el) {
            logger.error(e.message)
            return null
        }
    }

    async m_deleteProductFromCart(idc, idp){
        try {

            console.log('idp service: ' , idp);
            let prdcart=  await cartDAO.deleteProductCart(idc,idp);
            console.log("prdcart service: ", prdcart.modifiedCount);

            let prdcartresult= prdcart.modifiedCount;

            return prdcartresult;
        } catch (e) {
            logger.error(e.message)
            return null
        }
    }

}