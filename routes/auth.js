import {Router} from 'express';
import { check } from 'express-validator';

import { validarCampos } from '../middlewares/validar-campos.js';

import {login} from '../controllers/auth.js';

const router = Router();

router.post('/login',[
  
   check('correo','No es un correo valido').isEmail(),
   check('password','La contrasena es obligatoria').not().isEmpty(),
   validarCampos
   ],login)

export {router};