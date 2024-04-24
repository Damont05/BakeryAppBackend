import jwt from "jsonwebtoken"
import nodemailer from 'nodemailer'
import { config } from './config/config.js';



const transport=nodemailer.createTransport(
    {
        service: 'gmail',
        port: 587, 
        auth: {
            user: config.MAIL_NODEMAILER,
            pass: config.PASS_NODEMAILER
                    
        }
    }
)

export const m_postEmail = ( email, subject, html) => {

    let token=jwt.sign({...email}, "CoderCoder123", {expiresIn:"1h"})


    console.log('ENTRANDO AL m_postEmail');

    return transport.sendMail(
        {
            from: "Luis D Montero luisdanielmonterofalcon@gmail.com",
            to: email,
            subject: subject,
            html:html,
        }
    )
}
