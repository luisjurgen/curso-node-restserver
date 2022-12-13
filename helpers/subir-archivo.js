import path from 'path';
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.',import.meta.url));

import {v4 as uuidv4} from 'uuid';

const subirArchivo =(files,extensionesValidas = ['jpg','png','jpeg','gif'], carpeta='')=>{

   return new Promise((resolve,reject)=>{

      const {archivo} = files
   
      const nombreCortado = archivo.name.split('.');
      const extension = nombreCortado[nombreCortado.length-1];
   
      //validar la extension
      if(!extensionesValidas.includes(extension)){
         return reject(`La extension ${extension} no es permitida, ${extensionesValidas}`)   
      }
   
      const nombreTemp = uuidv4() +'.'+extension;
   
      const uploadPath = path.join(__dirname,'../uploads/',carpeta, nombreTemp)
      // Use the mv() method to place the file somewhere on your server
      archivo.mv(uploadPath, (err)=> {
        if (err){
           reject(err);
        }
   
        resolve(nombreTemp);
      });
   })
}

export {subirArchivo}