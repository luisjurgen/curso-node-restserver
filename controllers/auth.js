import {response} from 'express';
import bcrypt from 'bcryptjs';

import { Usuario } from '../models/usuario.js';
import { generarJWT } from '../helpers/generar-jwt.js';

const login = async (req,res=response)=>{

   const {password, correo} = req.body;

   try {
      //verificar si el email existe
      const usuario = await Usuario.findOne({correo});
      if(!usuario){
         return res.status(400).json({
            msg: 'Usuario/Password no son correctos - correo'
         })
      }
      //si el usuario esta activo
      if(!usuario.estado){
         return res.status(400).json({
            msg: 'Usuario/Password no son correctos - estado: false'
         })
      }

      //verificar la contrasena
      const validPassword = bcrypt.compareSync(password,usuario.password);
      if(!validPassword){
         return res.status(400).json({
            msg: 'Usuario/Password no son correctos - password'
         })
      }

      //Generar el JWT
      const token = await generarJWT (usuario.id)

      res.json({
         usuario,
         token
         
      })

      
   } catch (error) {
      console.log(error);
      res.status(500).json({
         msg: 'Hable con el administrador'
      })
   }  

}

export {login}