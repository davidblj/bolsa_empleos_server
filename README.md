# Instrucciones de instalación

### MongoDB

Para *[linux](https://stackoverflow.com/questions/33693635/mongod-error-while-loading-shared-libraries-libssl-so-10-libcrypto-so-10)*

Para *[windows](https://www.mongodb.com/download-center#community)*


### NodeJS

Para *[Windows y linux](https://nodejs.org/en/download/)*

# Ejecución del proyecto


Si lo estamos ejecutando por primera vez:

> yarn install  

Modificamos el script "startMongo" en el archivo "package.json" para que apunte a una carpeta del sistema (\<path>)

> "startMongo": "mongod --dbpath \<path>"

Luego se inicializa la base de datos y el servidor:

> npm run startMongo

> npm run startServer

