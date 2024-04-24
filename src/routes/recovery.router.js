import { Router } from 'express';
import { m_postEmail } from '../mailing.js';
import jwt from "jsonwebtoken"
import { userModel } from '../dao/models/users.model.js';
export const router = Router()





// router.post("/", async(req,res)=>{

//     let { email } = req.body;

//     let resultado
//     try {
//         resultado=await m_postEmail(email)

//         console.log('resultado: ', resultado);

//         if(resultado.accepted.length>0){
//             res.setHeader('Content-Type','application/json');
//             return res.status(200).json({payload:"Mail enviado...!!!"});
//         }else{
//             res.setHeader('Content-Type','application/json');
//             return res.status(500).json({error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`})
//         }

//     } catch (error) {
//         console.log(error)
//         res.setHeader('Content-Type','application/json');
//         return res.status(500).json({error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, error})
//     }

// })



router.get("/recupero02", (req, res) => {
    let { token } = req.query

    try {
        let datosToken = jwt.verify(token, "CoderCoder123")
        res.redirect("http://localhost:8080/recupero02.html?token=" + token)
    } catch (error) {

        res.redirect("http://localhost:8080/index.html?mensaje=Error token:" + error.message)

    }
})

router.post("/recupero03", async (req, res) => {
    let { password, password2, token } = req.body

    console.log('password: ' + password);
    console.log('password2: ' + password2);
    console.log('token: ' + token);

    if (password !== password2) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Claves difieren...!!!` })
    }

    try {
        let datosToken = jwt.verify(token, "CoderCoder123")
        console.log('estos son los datos del token', datosToken)

        const email = datosToken;

        console.log(email);

        let emailAddress = '';
        for (let i = 0; i < datosToken.length; i++) {
            if (typeof datosToken[i] === 'string') {
                emailAddress += datosToken[i];
            }
        }

        console.log('emailAddress: ', emailAddress);

        let usuario = await userModel.findOne({ email: datosToken.email }).lean()
        if (!usuario) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Error de usuario` })
        }
        if (bcrypt.compareSync(password, usuario.password)) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Ha ingresado una contraseña utilizada en el pasado. No esta permitido` })
        }
        console.log("llego 01")
        let usuarioActualizado = { ...usuario, password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)) }
        console.log("llego 02")

        console.log(usuarioActualizado)
        await userModel.updateOne({ email: datosToken.email }, usuarioActualizado)
        console.log("llego 03")


        res.status(200).render("login", {
            mensaje: 'Contraseña reseteada exitosamente',

        })
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador` })
    }


})
