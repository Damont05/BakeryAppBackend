
import { CartService } from '../service/carts.service.js';
import { CartDAO } from '../dao/cart.dao.js';
import { CustomError,TYPES_ERRORS } from '../utils/errors.js';


const cartService = new CartService();

export const getCartById = async (req, res, next) => {

    let { idc } = req.params

    let cart
    try {
        // llamar al dao.findById...
        cart = await cartService.m_getById_s(idc);
    } catch (e) {
        return next(e)
    }
    res.setHeader('Content-Type', 'application/json')
    res.status(200).json({ cart })
}

export const getCarts = async (req, res, next) => {

    let cart
    try {
        // llamar al dao.findById...
        cart = await cartService.m_get_s();
    } catch (e) {
        return next(e)
    }
    res.setHeader('Content-Type', 'application/json')
    res.status(200).json({ cart })
}

export const addProductCart = async (req, res) => {

    try {
        let { idc, idp } = req.params
        
        // llamar al dao.findById...
        let cart = await cartService.m_getById_s(idc);
        
        if (!cart) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({ error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador` })
        }
    
        let productIndex = cart.products.findIndex(p => p.product._id == idp)
    
        if (productIndex !== -1) {
            cart.products[productIndex].quantity++
    
        } else {
            cart.products.push({ product: idp, quantity: 1 })
        }
    
        await cartService.m_update(idc, cart)
    
        cart = await cartService.m_getById_s(idc);
    
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ updateCart: cart });

    } catch (e) {
            throw new CustomError("Error addProductCart()", e.message, e.codigo?e.codigo:TYPES_ERRORS.DATABASE, e.descrip
            ?e.descrip:"Unexpected error, contact your administrator");
    }

}


export const m_delProdCart = async (req, res) => {

    try {

        let { idc, idp } = req.params;

        if (!idc) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Invalid ID cart` })
        }

        if (!idp) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Invalid ID product in cart` })
        }

        //buscamos el producto dentro del array de carritos
        let cart;
        try {
            cart = await cartService.m_getById_s(idc);

            if (cart === null) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: ` ID null` })
            }
        
        } catch (error) {
            res.setHeader("Content-Type", "application/json");
            return res.status(500).json({
                error: `error inesperado en el servidor -Intente mas tarde`,
                detalle: error.message,
            });
        }

        let productCartID;
        productCartID = await cartService.m_deleteProductFromCart(idc, idp);

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ updateCart: cart, num: productCartID });

    } catch (e) {
        throw new CustomError("Error m_delProdCart()", e.message, e.codigo?e.codigo:TYPES_ERRORS.DATABASE, e.descrip
        ?e.descrip:"Unexpected error, contact your administrator");
    }

}


export const m_delProductsCart = async (req, res) => {
    let { idc } = req.params
    let productCartID;
    productCartID = await CartDAO.deleteProductsCart(idc)


    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ productCartID});
    
}

export const m_add_res_cant = async (req, res) => {

    let { idc, idp, op } = req.params

    // llamar al dao.findById...
    let cart = await cartService.m_getById_s(idc);

    if (!cart) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador` })
    }

    let productIndex = cart.products.findIndex(p => p.product._id == idp)


    if (productIndex !== -1) {
      
        if  (op === "sum") {
            cart.products[productIndex].quantity++
        }

        if  (op === "res") {
            cart.products[productIndex].quantity--
        }

    }

    await cartService.m_update(idc, cart)

    cart = await cartService.m_getById_s(idc);

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ updateCart: cart });

}


