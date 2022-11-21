import {Router} from 'express';
import { check } from 'express-validator';

import{
  validarCampos,
  validarJWT,
  esAdminRole,
  tieneRole
} from '../middlewares/index.js'

import { emailExiste, esRoleValido, existeUsuarioPorId } from '../helpers/db-validators.js';

import { usuariosDelete, usuariosGet, usuariosPatch, usuariosPost, usuariosPut } from '../controllers/usuarios.js'


const router = Router();

router.get('/', usuariosGet)

 router.put('/:id', [
    check('id').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRoleValido),
    validarCampos
 ],usuariosPut )

 router.post('/',[
   check('nombre','No debe estar vacio').not().isEmpty(),
   check('password','El password debe de ser mas de 6 letras').isLength({min:6}),
   check('correo','El correo no es valido').isEmail(),
   check('correo').custom(emailExiste),
  //  check('rol', 'No es un rol valido').isIn(['ADMIN_ROLE','USER_ROLE']),
  check ('rol').custom(esRoleValido),
   validarCampos
 ], usuariosPost)

 router.delete('/:id',[
  validarJWT,
  // esAdminRole,
  tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
  check('id').isMongoId(),
  check('id').custom(existeUsuarioPorId),
  validarCampos
 ] ,usuariosDelete)

 router.patch('/', usuariosPatch)

 export {router}