import express from 'express';
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.',import.meta.url));

import cors from 'cors';
import {router as routerUsuarios} from '../routes/usuarios.js';
import {router as routerAuth} from '../routes/auth.js';
import { dbConnection } from '../database/config.js';


class Server{
   constructor(){
      this.app = express();
      this.port = process.env.PORT;
      this.usuariosPath = '/api/usuarios';
      this.authPath = '/api/auth';

      //Conectar a base de datos
      this.conectarDB();

      //Middlewares (funciones que van a anadirle otra funcion a nuestro webserver)
      this.middlewares();
      
      //Rutas de mi aplicacion
      this.routes();

   }
   async conectarDB(){
      await dbConnection();
   }

   middlewares(){
      //CORS
      this.app.use(cors())

      //Lectura y parseo del body
      this.app.use(express.json());

      //directorio publico
      this.app.use(express.static('public'));
   }

   routes(){
      this.app.use(this.authPath,routerAuth);

      this.app.use(this.usuariosPath, routerUsuarios);
      
   }
   listen(){
      this.app.listen(this.port, () => {
         console.log(`Example app listening on port ${this.port}`)
      })

   }
   
}

export {Server}