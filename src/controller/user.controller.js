import mongoose from 'mongoose';
import { userModel }   from '../dao/models/users.model.js';
import { UserService } from '../service/user.service.js';
import { generaHash} from '../utils/utils.js';

const userService= new UserService();


export class userController{

    static async getUsers(req,res){

        let users=[];
        try {
            users = await userService.m_getUsers_s();
        } catch (e) {
        }
        res.status(200).json({
            users
        })
    }

    static async createUser(req,res){

        let {first_name,last_name, email,password,age}=req.body

        if(!first_name || !last_name || !email || !password || !age ){
            res.setHeader('Content-Type','application/json');
            return res.status(404).json({  ok:false, error: `fields are required`});
        }
        password=generaHash(password)

        try {    

            let newUser = await  userService.m_create_s(first_name,last_name, email, age, password)
            res.setHeader('Content-Type','application/json');
            return res.status(200).json({ ok:true, newUser});
        } catch (e) {
        }
    }

    static async getUsersById(req,res){

        let {id} = req.params

        //devuelve true o false - validar si el id es valido
        if(!mongoose.Types.ObjectId.isValid(id)){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({ ok:false, error: `Ingrese un id valido`}); 
        }
        let existe 
        try {
            existe = await userService.m_getUsersById_s(id)
        } catch (error) {
            res.setHeader('Content-Type','application/json');
            return res.status(500).json({ ok:false, error: 'Error en el servidor'});
        }
        if(!existe){
            res.setHeader('Content-Type','application/json');
            return res.status(404).json({ ok:false, error: `No existen usuarios con id ${id}`}); 
        }
        res.setHeader('Content-Type','application/json');
        return res.status(200).json({ ok:true, user:existe});
    }

    static async updateUser(req,res){

        let {id} = req.params

        //devuelve true o false - validar si el id es valido
        if(!mongoose.Types.ObjectId.isValid(id)){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({ ok:false, error: `Ingrese un id valido`}); 
        }
        let existe
        try {
            existe = await usersModel.findOne({user:existe, _id:id})
        } catch (error) {
            res.setHeader('Content-Type','application/json');
            return res.status(500).json({ ok:false, error: 'Error en el servidor'});
        }
        if(!existe){
            res.setHeader('Content-Type','application/json');
            return res.status(404).json({ ok:false, error: `No existen usuarios con id ${id}`}); 
        }
        
    
        if(req.body._id){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({ ok:false, error: `No se puede modificar la propiedad _id`}); 
        }   
        let result
        try {
            result = await userModel.updateOne({user:existe, _id:id}, req.body)
            res.setHeader('Content-Type','application/json');
            return res.status(200).json({ ok:true, payload:result});
        } catch (error) {
            res.setHeader('Content-Type','application/json');
            return res.status(500).json({ ok:false, error: 'Error en el servidor'});
            
        }
    }

}