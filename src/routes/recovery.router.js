import { Router } from 'express';
import { m_postEmail } from '../mailing.js';
import jwt from "jsonwebtoken"
import { userModel } from '../dao/models/users.model.js';
export const router = Router()


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


    if (password !== password2) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Claves difieren...!!!` })
    }

    try {
        let datosToken = jwt.verify(token, "CoderCoder123")

        const email = datosToken;

        let emailAddress = '';
        for (let i = 0; i < datosToken.length; i++) {
            if (typeof datosToken[i] === 'string') {
                emailAddress += datosToken[i];
            }
        }

        let usuario = await userModel.findOne({ email: datosToken.email }).lean()
        if (!usuario) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Error de usuario` })
        }
        if (bcrypt.compareSync(password, usuario.password)) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Ha ingresado una contraseña utilizada en el pasado. No esta permitido` })
        }
        let usuarioActualizado = { ...usuario, password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)) }

        await userModel.updateOne({ email: datosToken.email }, usuarioActualizado)


        res.status(200).render("login", {
            mensaje: 'Contraseña reseteada exitosamente',

        })
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador` })
    }


})
