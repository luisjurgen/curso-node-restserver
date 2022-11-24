import {Router} from 'express';
import { check } from 'express-validator';

import { validarCampos } from '../middlewares/validar-campos.js';

import {googleSignIn, login} from '../controllers/auth.js';

const router = Router();

router.post('/login',[
  
   check('correo','No es un correo valido').isEmail(),
   check('password','La contrasena es obligatoria').not().isEmpty(),
   validarCampos
],login)

router.post('/google',[
   check('id_token','id_token es necesario').not().isEmpty(),
   validarCampos
],googleSignIn)
   

export {router};