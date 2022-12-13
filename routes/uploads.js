import {Router} from 'express';
import {check} from 'express-validator';

import { validarCampos, validarArchivoSubir } from '../middlewares/index.js';
import { cargarArchivo,actualizarImagen, mostrarImagen, actualizarImagenCloudinary } from '../controllers/uploads.js';
import { coleccionesPermitidas } from '../helpers/index.js';

const router = Router();

router.post('/',[validarArchivoSubir],cargarArchivo);

router.put('/:coleccion/:id',[
   validarArchivoSubir,
   check('id','No es un id de Mongo valido').isMongoId(),
   check('coleccion').custom(c=> coleccionesPermitidas(c,['usuarios','productos'])),
   validarCampos
],actualizarImagenCloudinary)
// ],actualizarImagen);

router.get('/:coleccion/:id',[
   check('id','No es un id de Mongo valido').isMongoId(),
   check('coleccion').custom(c=> coleccionesPermitidas(c,['usuarios','productos'])),
   validarCampos
],mostrarImagen)

export {router}