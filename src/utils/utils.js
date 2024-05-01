import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from "bcrypt"
import passport from 'passport';

const __filename = fileURLToPath(import.meta.url);
const  __dirname   = dirname(__filename);

export default __dirname;


export const generaHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const validaPass = (user, password) => bcrypt.compareSync(password, user.password)

export const passportView = (estrategia) => function (req, res, next) {
    passport.authenticate(estrategia, function (err, user, info, status) {
        if (err) {
            return next(err) 
        }
        if (!user) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({ error: info.message ? info.message : info.toString() })
        }
        req.user = user

        next()
    })(req, res, next);
}