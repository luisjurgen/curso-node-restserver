import {Router} from 'express';
import {check} from 'express-validator';

import { actualizarProducto, borrarProducto, crearProducto, obtenerProducto, obtenerProductos } from '../controllers/productos.js';
import { existeCategoriaPorId, existeProductoPorId } from '../helpers/db-validators.js';
import { validarJWT, validarCampos, esAdminRole } from '../middlewares/index.js';

const router = Router();

//Obtener todos los productos - publico
router.get('/', obtenerProductos);


//Obtener un producto por id - publico
router.get('/:id',[
   check('id','no es un id de Mongo valido').isMongoId(),
   check('id').custom(existeProductoPorId),
   validarCampos
],obtenerProducto);


//Crear producto - privado cualquier persona con un token valido
router.post('/', [
   validarJWT,
   check('nombre','El nombre es obligatorio').not().isEmpty(),
   check('categoria','No es un id de Mongo valido').isMongoId(),
   check('categoria').custom(existeCategoriaPorId),
   validarCampos
], crearProducto);


//Actualizar - privado - cualqueira con token valido
router.put('/:id',[
   validarJWT,
   // check('categoria','No es un id de Mongo valido').isMongoId(),
   check('id').custom(existeProductoPorId),
   validarCampos
] ,actualizarProducto);


//Borrar una categoria - Admin
router.delete('/:id', [
   validarJWT,
   esAdminRole,
   check('id','No es un id de Mongo valido').isMongoId(),
   check('id').custom(existeProductoPorId),
   validarCampos
],borrarProducto);

export {router}  