import mongoose from 'mongoose';
import { config } from './config/config.js';
import { logger } from "./utils/loggers.js";

//connection database mongo
let url = config.MONGO_URL;
let dbName = config.DBNAME;

try {
    await mongoose.connect(url,{dbName})
    logger.info('db Online!!');
} catch (e) {
    logger.error(e.message);
}

export default mongoose;

