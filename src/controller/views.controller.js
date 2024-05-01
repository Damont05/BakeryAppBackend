import { ProductService } from "../service/products.service.js";
import { CartService } from "../service/carts.service.js";
import { ticketModelo } from "../dao/models/ticket.model.js"




const productService = new ProductService();
const cartService = new CartService();

export const m_getProducts = async (req, res) => {
    let products = await productService.m_getProduct_s();



    // map a productos, para agregar una propiedad carrito_id
    if (!products) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: `Unexpected server error - Try again later, or contact your administrator` })
    }
    res.setHeader('Content-Type', 'text/html')
    res.status(200).render('products', { products, user:req.user, estilo: "style" })
}

export const m_login = (req, res) => {
    let { error, mensaje } = req.query
    res.setHeader('Content-Type', 'text/html')
    res.status(200).render('login', { error, mensaje, estilo: "style" })
}

export const m_register = (req, res) => {
    let { error } = req.query
    res.setHeader('Content-Type', 'text/html')
    res.status(200).render('register', { error, estilo: "style" })
}

export const m_home = (req, res) => {
    let { error, mensaje } = req.query
    res.setHeader('Content-Type', 'text/html')
    res.status(200).render('login', { estilo: "style" })
}

export const m_getOneCart = async (req, res) => {
    let id = req.params.idc;
    try {
        let cart = await cartService.m_getById_s(id);
        if (!cart) {
            res.status(404).json("Carrito no encontrado");
        } else {
            res.setHeader('Content-Type', 'text/html')
            res.status(200).render('carts', { cart, id, estilo:"style"});
        }
    } catch (error) {
        //req.logger.error(error)
        res.status(500).json({ error: "Error al obtener el carrito" });
    }
}

export const m_buyCart = async (req, res) => {

    let idCart = req.user.idc;

    let email = req.user.email;

    let cart
    try {
        cart = await cartService.m_getById_s(idCart);
        if (!cart) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Cart with id ${idCart} not found...!!!` })
        }


        let { noStock, productsStock } = await productService.updateProductQuantities(cart);

        let amount = productsStock.reduce((totalAmount, product) => {
            // Accede al precio del producto desde la propiedad product.price
            const price = product.product.price;


            // Verifica si el precio es un número válido
            if (!isNaN(price)) {
                // Multiplica el precio del producto por su cantidad y lo agrega al monto total
                return totalAmount + price * product.quantity;
            } else {
                // Si el precio no es un número válido, retorna el monto total sin cambios
                return totalAmount;
            }
        }, 0);

        const nuevoTicketData = {
            purchase_datetime: new Date(),
            products: productsStock,
            amount: amount,
            purchaser: req.user.email,
        };

        const nuevoTicket = await ticketModelo.create(nuevoTicketData);
        
        res.setHeader('Content-Type', 'text/html')
        return res.status(200).render('tickets', {estilo:"style",
            purchase_datetime: nuevoTicketData.purchase_datetime,
            products: nuevoTicketData.products,
            amount: nuevoTicketData.amount,
            purchaser: nuevoTicketData.purchaser,
            noStock: noStock        
        })
    } catch (e) {
        res.status(500).json({ error: "Error m_buyCart", e });
    }
}

