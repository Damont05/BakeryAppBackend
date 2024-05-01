import express from "express";
import { ProductService } from "../service/products.service.js";
const router = express.Router();

const productManager = new ProductService();

router.get("/realTimeProducts", async (req, res) => {

    try {
        
        let result = await productManager.listarUsuarios();
        if (req.query.limit) {
          result = result.slice(0, req.query.limit);
        }
        res.setHeader("Content-Type", "text/html");
        res.status(200).render("realTimeProducts", { result });

    } catch (e) {
        req.logger.error(e);
        res.status(500).json({ error: "error when adding product" });
    }

});

router.post("/realTimeProducts", async (req, res) => {

    const { title, description, code, price, stock, category, thumbnail } = req.body;

    if (!title ||
        !description ||
        !code ||
        !price ||
        !stock ||
        !category 
    ){
        return res.status(400).json({ error: "all fields are required" });
    }
    try {
        const addProduct = await productManager.addProduct(req.body);
        res.setHeader("Content-Type", "application/json");
        res.status(201)
            .json({ message: "product successfully added", product:addProduct });

        req.io.emit("productAdded", {
        message: "new product added",
        product: addProduct,
        });
    } catch (e) {
        req.logger.error(e);
        res.status(500).json({ error: "error when adding product" });
    }
});


export default router;