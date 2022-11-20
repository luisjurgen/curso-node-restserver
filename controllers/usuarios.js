import { response, request} from "express";
import bcrypt from 'bcryptjs';


import {Usuario} from '../models/usuario.js';

const usuariosGet= async (req=request, res=response) => {

   const {limite=5, desde=5} = req.query;
   const query = {estado:true};

   const [total,usuarios] = await Promise.all([
      Usuario.countDocuments(query),
      Usuario.find(query)
         .skip(Number(desde))
         .limit(Number(limite))
   ])


   res.json({
      total,
      usuarios
   })
}
const usuariosPost = async (req, res=response) => {

   const {nombre, password, correo,rol} = req.body;
   const usuario = new Usuario({nombre,password,correo,rol}); 

   

   //Encriptar contrasena
   const salt = bcrypt.genSaltSync(10);
   usuario.password = bcrypt.hashSync(password,salt);
   //Guardar en BD
   await usuario.save();
   
   res.json({
      msg: "post API - controlador",
      usuario
   })
}

const usuariosPut = async (req, res=response) => {
   const {id} = req.params;
   const {_id,password, google, correo, ...resto} = req.body;

   if(password){
      //encriptar la contrasena 
      const salt = bcrypt.genSaltSync(10);
      resto.password = bcrypt.hashSync(password,salt);

   }
   const usuario = await Usuario.findByIdAndUpdate(id,resto);

   res.json(
      
      usuario
   )
}


const usuariosPatch= (req, res=response) => {
   res.json({
      msg: "patch API - controlador"
   })
}

const usuariosDelete= async (req, res=response) => {
   const {id} = req.params;

   //Fisicamente lo borramos
      // const usuario = await Usuario.findByIdAndDelete(id);

   //oculto en la base de datos
      const usuario = await Usuario.findByIdAndUpdate(id, {estado:false}); 


   res.json(
      usuario
   )
}

export{
   usuariosGet,
   usuariosPost,
   usuariosPut,
   usuariosPatch,
   usuariosDelete
}