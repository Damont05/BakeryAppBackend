import {userModel} from './models/users.model.js';


export class userDAO{

    static async get(){
        return await userModel.find().lean();
    }

    static async create(user){
        return await userModel.create(user)
    }

    static async getById(id){
        return await userModel.findById(id)
    }
}
