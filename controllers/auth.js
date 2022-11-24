import {response} from 'express';
import bcrypt from 'bcryptjs';

import { Usuario } from '../models/usuario.js';
import { generarJWT } from '../helpers/generar-jwt.js';
import { googleVerify } from '../helpers/google-verify.js';

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

const googleSignIn=async (req,res=response)=>{
   const {id_token} =req.body;

   try {
      const {nombre,correo,img}= await googleVerify(id_token);
      
      let usuario = await Usuario.findOne({correo});

      if(!usuario){
         //Tengo que crearlo
         const data={
            nombre,
            correo,
            password:':P',
            img
         }

         usuario = new Usuario(data);
         await usuario.save();
      }

      //Si el usuario en DB esta 'false'
      if(!usuario.estado){
         return res.status(401).json({
            msg: 'Hable con el administrado, usuario bloqueado'
         })
      }

      //Generar el JWT
      const token = await generarJWT(usuario.id);

      res.json({
         usuario,
         token
      })

   } catch (error) {

      res.status(400).json({
         ok: false,
         msg:'El token no se pudo verificar'
      })
      
   }

}

export {login, googleSignIn}