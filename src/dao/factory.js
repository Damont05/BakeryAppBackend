import mongoose from 'mongoose'
import { config } from '../config/config.js';
import { logger } from "../utils/loggers.js";
const persistenc=config.PERSISTENCE
export let DAO

switch (persistenc) {
    case "FS":
        let {usuariosFsDAO} = await import("./usuariosFsDAO.js")
        DAO=usuariosFsDAO
        break;

    case "MONGO":
        try {
            await mongoose.connect(config.MONGO_URL, {
                dbName: config.DBNAME
            })
            logger.info("DB Online...!!!")
        } catch (error) {
            console.log(error)
        }
        
        let {usersMongoDAO} = await import("./usersMongoDAO.js")
        DAO=usersMongoDAO
        
        break;
        
    default:
        logger.error("Error en persistencia seleccionada...!!!")
        process.exit()
        break;
}