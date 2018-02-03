# Requerimientos

*[MongoDB](https://www.mongodb.com/)*

*[NodeJS](https://nodejs.org/en/)*

*[Yarn](https://yarnpkg.com/en/)*
 
# Ejecución

Se instalan las dependencias:

> yarn install  

Se modifica la ruta del script "mongo" (package.json) 

> "mongo": "mongod --dbpath \<path>"

Se inicia MongoDB y se sirve la aplicación:

> yarn run mongo

> yarn run devserver

# Documentación

Documentación de la *[API](https://bolsa.docs.apiary.io/#)*.

La documentación del código se auto genera con: 

> yarn run doc

# DevOps

Analísis estático del código con *[SonarQube](https://sonarcloud.io/organizations/davidblj-github/projects)*.

Integración continua con *[Travis CI](https://travis-ci.org/davidblj/bolsa_empleos_server)*.