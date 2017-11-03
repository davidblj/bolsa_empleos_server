# Instrucciones de instalación

### MongoDB

Para *[linux](https://stackoverflow.com/questions/33693635/mongod-error-while-loading-shared-libraries-libssl-so-10-libcrypto-so-10)*

Para *[windows](https://www.mongodb.com/download-center#community)*


### NodeJS

Para *[Windows y linux](https://nodejs.org/en/download/)*

# Ejecución del proyecto


Aquí el orden es importante.

Si lo estamos ejecutando por primera vez, o al menos una nueva librería se ha añadido :

> npm install  

Para inicializar la base de datos:

> mongod --dbpath <path>

Para iniciar el servidor:

> npm run startServer

Para ejecutar el cliente:

> npm run startProxy