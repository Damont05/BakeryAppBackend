import { userDAO } from "../dao/user.dao.js";

export class UserService {
    
    async m_getUsers_s(){
        return await userDAO.get();
    }

    async m_getUsersById_s(id){
        return await userDAO.getById(id);
    }

    async m_create_s(first_name,last_name, email, age, password){
        return await userDAO.create({first_name,last_name, email, age, password})
    }
}

