import {Router} from 'express';
import {userController} from '../controller/user.controller.js'
export const router = Router();
  
router.get('/', userController.getUsers)
router.post('/', userController.createUser)
router.get('/:id', userController.getUsersById)
router.put('/:id', userController.updateUser)



