# Daily apside Backend con NodeJs #

## Info
Backend para la plataforma front end dailyApside mas para la funcionalidad del bot "Andres Cea". el proyecto fue hecho con expressJs, las librerias usadas son (mirar package.json):
- discordJs
- express
- mysql
- ws
- node-cron
- @discordjs/voice
- cors

## para Iniciar el proyecto
- tener las variables necesarias del .env, tomar de referencia .env-example
  
```
npm install
```
```
nodemon app.js
```

- iniciar cron

```
node .\cron\resetAssisted.js
```

## Reparto

- owner: Diego Ramirez dramirez@apside.cl
- contributors:
  - etc etc@etc.cl
