import {Router} from 'express';
import { check } from 'express-validator';

import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { actualizarCategoria, borrarCategoria, crearCategoria, obtenerCategoria, obtenerCategorias } from '../controllers/categorias.js';
import { existeCategoriaPorId } from '../helpers/db-validators.js';
import { esAdminRole } from '../middlewares/validar-roles.js';

const router = Router();

//Obtener todas las categorias - publico
router.get('/',
   obtenerCategorias
)

//Obtener una categoria por id - publico
router.get('/:id',[
   check('id','No es un id de Mongo valido').isMongoId(),
   check('id').custom(existeCategoriaPorId),
   validarCampos
],
obtenerCategoria);

//Crear categoria - privado 0cualquier persona con un token valido
router.post('/',[
   validarJWT,
   check('nombre','El nombre es obligatorio').not().isEmpty(),
   validarCampos
   
],crearCategoria);

//Actualizar - privado - cualquiera con toke valido
router.put('/:id',[
   validarJWT,
   check('nombre','El nombre es obligatorio').not().isEmpty(),
   check('id').custom(existeCategoriaPorId),
   validarCampos
],actualizarCategoria);

//Borrar una categoria - Admin
router.delete('/:id',[
   validarJWT,
   esAdminRole,
   check('id','No es un id de Mongo valido').isMongoId(),
   check('id').custom(existeCategoriaPorId),
   validarCampos
],borrarCategoria)


export {router};