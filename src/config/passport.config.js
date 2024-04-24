import passport from "passport";
import local from "passport-local"
import JWT from "passport-jwt"

import { userModel } from "../dao/models/users.model.js"
import { generaHash, validaPass } from "../utils/utils.js"
import {  CartService } from "../service/carts.service.js"

let cartService=new CartService()

const buscaToken=(req)=>{
    let token=null
    if(req.cookies.codercookie){
        token=req.cookies.codercookie
    }
    return token
}

export const initPassport=()=>{
    passport.use("register", new local.Strategy(
        {
            usernameField:"email",
            passReqToCallback:true
        },
        async (req, username, password, done)=>{
            try {
                let {first_name,last_name, email,age}=req.body
                let role = 'user'
                

                if(!first_name || !last_name || !email || !password || !age ){
                    return done(null, false, {message:"Complete los datos nombre / email / password"})
                }
                
                let existe=await userModel.findOne({email})
                if(existe){
                    return done(null, false, {message:`Ya existe un usuario con email ${email}`})
                }
                
                let newCart=await cartService.m_addCart_s()
                password=generaHash(password)

                let user=await userModel.create(
                    {
                        first_name,last_name,email,age,password,role,
                        idc:newCart._id
                    }
                )
                
                return done(null, user)

            } catch (e) {
                return done(e)
            }
        }
    ))

    passport.use("login", new local.Strategy(
        {
            usernameField:"email"
        },
        async(username, password, done)=>{
            try {
                let user=await userModel.findOne({email:username}).lean()
                if(!user){
                    done(null, false, {message:"Credenciales incorrectas...!!!"})

                }
                if(!validaPass(user, password)){
                    return done(null, false, {message:"Credenciales incorrectas...!!!"})
                }

                return done(null, user)

            } catch (e) {
                return done(e)
            }
        }
    ))

    passport.use("jwt", new JWT.Strategy(
        {
            secretOrKey:"CoderCoder123",
            jwtFromRequest:new JWT.ExtractJwt.fromExtractors([buscaToken])
        },
        async (contenidoToken, done)=>{
            try {
                console.log("Cont.Token:",contenidoToken)
                return done(null, contenidoToken)                
            } catch (e) {
                return done(e)
            }
        }
    ))
}