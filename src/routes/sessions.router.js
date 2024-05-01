import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken'
import { passportView } from '../utils/utils.js';
import { m_postEmail } from '../mailing.js';
import bcrypt from 'bcrypt';


import { userModel } from '../dao/models/users.model.js';

export const router=Router()




router.post("/register", passportView('register',{failureRedirect:'/api/sessions/errorRegister'}), async(req, res)=>{
    // res.setHeader('Content-Type','application/json');
    // return res.status(201).json({usuarioRegistrado:req.user});
    let {email}=req.body
    res.redirect(`/login?mensaje=Usuario ${email} registrado correctamente`)
})

router.get('/errorRegister',(req,res)=>{
    return res.redirect('/registro?error=Error en el proceso de registro')
})

router.post("/login", passportView('login',{failureRedirect:'/api/sessions/errorLogin'}), async(req,res)=>{

    let token=jwt.sign({...req.user}, "CoderCoder123", {expiresIn:"1h"})

    res.cookie("codercookie", token)
    //res.setHeader('Content-Type','application/json');
    res.setHeader('Content-Type', 'text/html')
    //return res.status(200).json({usuarioLogueado:req.user});
    res.redirect('/products')
})

router.get('/errorLogin',(req,res)=>{
    return res.redirect('/login?error=Error en el proceso de login... :(')
})

router.get('/logout',(req,res)=>{

    res.clearCookie('codercookie') ;

    res.redirect('/login')
});


router.get('/github', passport.authenticate('github',{}), (req,res)=>{})

router.get('/callbackGithub', passport.authenticate('github',{failureRedirect:"/api/sessions/errorGithub"}), (req,res)=>{
    
    console.log("ACAAAAAAA:::: " +req.user)
    req.session.usuario=req.user
    res.setHeader('Content-Type','application/json');
    res.status(200).json({
        message:"Acceso OK...!!!", usuario: req.user
    });
});

router.get('/errorGithub',(req,res)=>{
    
    res.setHeader('Content-Type','application/json');
    res.status(200).json({
        error: "Error al autenticar con Github"
    });
});



router.post("/recupero01", async (req, res) => {

    let { email } = req.body

    let usuario = await userModel.findOne({ email }).lean()
    if (!usuario) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).redirect(`/login?error=No existe el email ${email}`);
    }
    delete usuario.password
    let token = jwt.sign({ ...usuario }, "CoderCoder123", { expiresIn: "1h" })

    let html = `Nos enteramos de que perdiste tu contraseña de tu panaderia favorita online 'Entreamasados'. ¡Lo lamento! 
    Haga click en el siguiente link para resetear contraseña: <a href="http://localhost:8080/api/sessions/recupero02?token=${token}">Resetear Contraseña</a>
    `
    let subject = `Recupero Password`;

    let respuesta = await m_postEmail(email, subject, html)

    if (respuesta.accepted.length > 0) {
        res.redirect(`/login?mensaje=Recibiras un mail al correo: ${email} con las intrucciones para resetear tu contraseña!!`);
        //res.render('login' , {mensaje, estilo:"style"})
    } else {
        res.redirect(`/login?error=Error al intentar recuperar contraseña`);

    }
})

router.get("/recupero02",(req,res)=>{
    let {token}=req.query

    try {
        let datosToken=jwt.verify(token, "CoderCoder123")
        res.redirect("http://localhost:8080/recupero02.html?token="+token)

    } catch (error) {
        res.redirect(`/login?error=Error token: ${error.message}`);

    }
})

router.post("/recupero03",async(req,res)=>{
    let {password, password2, token}=req.body


    if(password!==password2){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Claves difieren...!!!`})
    }
    try {
        let datosToken=jwt.verify(token, "CoderCoder123")
        let usuario=await userModel.findOne({email:datosToken.email}).lean()

        if(!usuario){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`Error de usuario`})
        }

        if(bcrypt.compareSync(password, usuario.password)){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`Ha ingresado una contraseña utilizada en el pasado. No esta permitido`})
        }


        let usuarioActualizado={...usuario, password:bcrypt.hashSync(password, bcrypt.genSaltSync(10))}

        await userModel.updateOne({email:datosToken.email}, usuarioActualizado)

        //res.redirect("http://localhost:3000/index.html?mensaje=Contraseña reseteada...!!!")
        res.redirect(`/login?mensaje=Contraseña del usuario: ${usuario.email} reseteada con exito.!`)
        
    } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(500).json({error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`})
    }


})


router.post("/:email/order/:amount", async (req, res) => {

    let { email, amount } = req.params

    let usuario = await userModel.findOne({ email }).lean()
    if (!usuario) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).redirect(`/login?error=No existe el email ${email}`);
    }

    let token = jwt.sign({ ...usuario }, "CoderCoder123", { expiresIn: "1h" })

    let html = `Compra realizada con exito, Disfruta de tu pedido!! 

    <br>
    <br>

    RESUMEN DEL TOTAL PAGADO EN TU PEDIDO:

    <h1>$ ${amount}</h1>  


    Muchas Gracias!

    `
    let subject = `Pedido Completado`;

    let respuesta = await m_postEmail(email, subject, html)

    if (respuesta.accepted.length > 0) {
        res.redirect("/products");
        //res.render('login' , {mensaje, estilo:"style"})
    } else {
        res.redirect(`/login?error=Error al completar pedido`);

    }
})