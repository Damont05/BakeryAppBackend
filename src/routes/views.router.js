
import { Router } from 'express';
import {m_getProducts,m_login,m_register,m_home,m_getOneCart,m_buyCart} from '../controller/views.controller.js'
import { passportView } from '../utils/utils.js';
export const router=Router()


router.get('/products', passportView("jwt"), m_getProducts);
router.get('/login', m_login);
router.get('/register', m_register);
router.get('/', m_home);
router.get('/:idc', passportView("jwt"),m_getOneCart);
router.get('/purchase/:cid', passportView("jwt"), m_buyCart);
