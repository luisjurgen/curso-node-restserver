import { response} from 'express';

import {existsSync, unlinkSync}from  'node:fs';

import path from 'path';
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.',import.meta.url));

import { v2 as cloudinary } from 'cloudinary'
cloudinary.config({
  cloud_name: "dm0ekdndr",
  api_key: "642443874248776",
  api_secret: "GbZkbXMQCbwl2MXu3COQKdvKzT8"
});

import { subirArchivo } from '../helpers/index.js';
import { Producto, Usuario } from '../models/index.js';


const cargarArchivo = async(req,res=response)=>{
   
   //imagenes
   try{
     const nombre = await subirArchivo (req.files,undefined,'imgs');
  
     res.json({
      nombre
     })

   }catch(msg){
    res.status(400).json({msg})
    
   }

  
}

const actualizarImagen = async (req,res=response)=>{
  const {coleccion, id} = req.params;

  let modelo; 

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if(!modelo){
        return res.status(400).json({
          msg:`No existe un usuario con el id ${id}`
        })
      }
    break;

    case 'productos':
      modelo = await Producto.findById(id);
      if(!modelo){
        return res.status(400).json({
          msg:`No existe un producto con el id ${id}`
        }) 
      }
    break;  
  
    default: 
      return res.status(500).json({msg:`Se me olvido validar esto`}) 
  }

  //limpiar imagenes previas
  if(modelo.img){
    //hay que borrar la imagen del servidor
    const pathImagen = path.join(__dirname,'../uploads',coleccion,modelo.img);
    if(existsSync(pathImagen)){
      unlinkSync(pathImagen);

    } 
  }

  const nombre = await subirArchivo(req.files,undefined,coleccion);
  modelo.img=nombre;
  
  await modelo.save();
  
  res.json({
    modelo
  })  
}


const actualizarImagenCloudinary = async (req,res=response)=>{
  const {coleccion, id} = req.params;

  let modelo; 

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if(!modelo){
        return res.status(400).json({
          msg:`No existe un usuario con el id ${id}`
        })
      }
    break;

    case 'productos':
      modelo = await Producto.findById(id);
      if(!modelo){
        return res.status(400).json({
          msg:`No existe un producto con el id ${id}`
        }) 
      }
    break;  
  
    default: 
      return res.status(500).json({msg:`Se me olvido validar esto`}) 
  }

  //Borrar imagen si ya existe
  if(modelo.img){
    const nombreArr = modelo.img.split('/');
    const nombre = nombreArr[nombreArr.length-1];
    const [public_id] = nombre.split('.');
    cloudinary.uploader.destroy(`node-cafe/${coleccion}/${public_id}`); 
  }

  //nueva imagen a actualizar
  const {tempFilePath} = req.files.archivo;
  const {secure_url} = await cloudinary.uploader.upload(tempFilePath,{folder:`node-cafe/${coleccion}`});
  

  modelo.img=secure_url;
  await modelo.save();

  res.json({
    modelo 
  })     
}



const mostrarImagen = async (req,res=response)=>{
  const {coleccion, id} = req.params;

  let modelo; 

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if(!modelo){
        return res.status(400).json({
          msg:`No existe un usuario con el id ${id}`
        })
      }
    break;

    case 'productos':
      modelo = await Producto.findById(id);
      if(!modelo){
        return res.status(400).json({
          msg:`No existe un producto con el id ${id}`
        }) 
      }
    break;  
  
    default: 
      return res.status(500).json({msg:`Se me olvido validar esto`}) 
  }

  //limpiar imagenes previas
  if(modelo.img){
    const pathImagen = path.join(__dirname,'../uploads',coleccion,modelo.img);
    if(existsSync(pathImagen)){
      return res.sendFile(pathImagen);

    } 
  }

  const pathImagen = path.join(__dirname,'../assets/no-image.jpg');
  res.sendFile(pathImagen);
 
}

export {cargarArchivo, actualizarImagen,mostrarImagen,actualizarImagenCloudinary};    