
//**************************************************************************/
//      |       Author      |       description         |    Date    |
//      |------------------ |---------------------------|------------|
//         Luis D. Montero  |  Servidor con ExpressJs   | 27-10-2023
//      |------------------ |---------------------------|------------|
//      |  Luis D. Montero  |                           |            |
//**************************************************************************/

//import __dirname from "./utils/utils.js"
import path  from "path";

import { fileURLToPath } from 'url';
import { dirname } from 'path';

import express from 'express';
import  {engine } from 'express-handlebars';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import { config } from './config/config.js';
//import sessions from 'express-session';
import mongoose from 'mongoose';
import mongoStore from 'connect-mongo';
import { logger } from "./utils/loggers.js";
import { initPassport } from './config/passport.config.js';
import { errorHandler } from './middleware/errorHandler.js';
import { Server } from 'socket.io';
import { MessageModel } from "./dao/models/mesagges.model.js";
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
//IMPORTS CON DB
import conn from './db.js';
//IMPORTS ROUTES
import realTimeProducts from "./routes/live.router.js";
import { router as views_router } from "./routes/views.router.js";
import { router as products_router} from "./routes/products.router.js";
import { router as carts_router} from "./routes/cart.router.js";
import { router as sessions_router } from './routes/sessions.router.js';
import { router as user_router } from './routes/user.router.js';
import { router as recovery_router } from './routes/recovery.router.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const  __dirname   = dirname(__filename);

const options={
    definition:{
        openapi:"3.0.0",
        info:{
            title: "API",
            version: "1.0.0",
            description: "Documentación API Bakery Ecommerce"
        }
    },
    apis: ["./src/docs/*.yaml"]
}
  
const specs=swaggerJsdoc(options)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs))

app.engine('handlebars', engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname,'views'));

app.use(cookieParser())

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
initPassport()
app.use(passport.initialize())

app.use(express.static(path.join(__dirname, 'public')));

app.get("/chat", (req, res) => {
    res.status(200).render("chat");
});

//Main Routes
app.use("/api/sessions", sessions_router);
app.use("/api/products", products_router);
app.use("/api/cart", carts_router);
app.use("/api/user", user_router);
app.use("/api/recovery",recovery_router);
app.use("/", views_router);

app.use(
    "/live",
    (req, res, next) => {
        req.io = io;
        next();
    },
    realTimeProducts
    );

app.use(errorHandler) 

//Server
const server =  app.listen(config.PORT, () => {
    logger.info(`Server on port`, config.PORT);
});

const io=new Server(server)

let users=[]
let messages=[]

//server socket
io.on("connection", (socket) => {
    logger.info(`Se ha conectado un cliente con id ${socket.id}`);

    socket.on('id', async(nombre) => {
        users.push({nombre, id:socket.id})
        socket.broadcast.emit('newUser',nombre)
    
        try {
            const mensajes = await MessageModel.find({}).lean();
            socket.emit("hello", mensajes);
        } catch (error) {
            console.error("Error al obtener mensajes de la base de datos:", error);
        }
    });

    socket.on("mensaje", async (datos) => {
        const nuevoMensaje = new MessageModel({
        messages: [{ user: datos.emisor, message: datos.mensaje }],
        });

        try {
            const mensajeGuardado = await nuevoMensaje.save();
            logger.info("Mensaje guardado en la base de datos:", mensajeGuardado);
            io.emit("nuevoMensaje", datos);
        } catch (error) {
            console.error("Error al guardar el mensaje en la base de datos:", error);
        }
    });


});