import dotenv from 'dotenv';

dotenv.config({
    override:true,
    path:"./src/.env"
})

 export const config={
        MONGO_URL:process.env.MONGO_URL,
        SECRETKEY:process.env.SECRETKEY,
        DBNAME:process.env.DBNAME,
        CLIENT_ID:process.env.CLIENT_ID,
        CLIENT_SECRET:process.env.CLIENTSECRET,
        CALLBACK_URL:process.env.CALLBACK_URL,
        PORT:process.env.PORT||8080,
        PERSISTENCE:process.env.PERSISTENCE||"FS",
        MODE:process.env.MODE||"production",
        MAIL_NODEMAILER:process.env.MAIL_NODEMAILER,
        PASS_NODEMAILER:process.env.PASS_NODEMAILER,
 }
