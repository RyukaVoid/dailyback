// importacion de modulos
console.info("Importando modulos");
const express = require('express');

const http = require('http');
const https = require('https');
const WebSocket = require('ws');
const cors = require('cors');

const bodyParser = require('body-parser');
const fs = require('fs');
require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');

const app = express();

// functiones
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function listRoutes(app, serverProtocol, serverIp, serverPort){
    let route, routes = [];

    app._router.stack.forEach(function(middleware){
        if(middleware.route){ // routes registered directly on the app
            routes.push(middleware.route);
        } else if(middleware.name === 'router'){ // router middleware 
            middleware.handle.stack.forEach(function(handler){
                route = handler.route;
                route && routes.push(route);
            });
        }
    });

    console.debug("==== Listando rutas ====");
    routes.forEach(function(route){
        try{
            const API_PREFIX = process.env.API_PREFIX || "/api";

            console.debug(
                Object.keys(route.methods)[0],
                '-',
                `${serverProtocol}://${serverIp}:${serverPort}${API_PREFIX}${route.path}`,
            );
        }catch(e){
            console.error("Error en listado de rutas");
            console.error(e);
        }
    });
    console.debug("==== Fin listado rutas ====");
}

// console.info("Montando multer");
// app.use(multer);

console.info("Montando static");
app.use(express.static(__dirname + '/public'));

const NODE_ENV = process.env.NODE_ENV || 'dev';
const HTTPS_SERVER = process.env.HTTPS_SERVER || false;
console.debug('NODE_ENV: ' + NODE_ENV);
console.debug('HTTPS_SERVER: ' + HTTPS_SERVER);

console.info("Montando cors");
app.use(cors());

console.info("Montando body parser");
app.use(bodyParser.urlencoded({ extended: true }));

console.info("Montando body parser json");
app.use(bodyParser.json());

// rutas
console.info("Montando rutas");
require('./startup/routes')(app);

// Despliegue
const HTTP_SERVER_PORT = process.env.HTTP_SERVER_PORT || 8999;
const HTTP_SERVER_IP = process.env.HTTP_SERVER_IP || 'localhost';
console.debug('PORT: ' + HTTP_SERVER_PORT);
console.debug('IP: ' + HTTP_SERVER_IP);

console.info("Desplegando servidor");

const httpServer = http.createServer(app).listen(
    HTTP_SERVER_PORT, HTTP_SERVER_IP, () => {
    console.log(`
        Servidor inicializado en http://${HTTP_SERVER_IP}:${HTTP_SERVER_PORT}
    `);
});

listRoutes(app, 'http', HTTP_SERVER_IP, HTTP_SERVER_PORT);

// const PATH_TO_KEY = process.env.PATH_TO_KEY || './key.pem';
// const PATH_TO_CERT = process.env.PATH_TO_CERT || './cert.pem';
// const PATH_TO_CSR = process.env.PATH_TO_CA || './csr.pem';
// console.debug('PATH_TO_KEY: ' + PATH_TO_KEY);
// console.debug('PATH_TO_CERT: ' + PATH_TO_CERT);
// console.debug('PATH_TO_CA: ' + PATH_TO_CSR);

// const credentials = {
//     key: fs.readFileSync(PATH_TO_KEY, 'utf8'),
//     cert: fs.readFileSync(PATH_TO_CERT, 'utf8'),
//     ca: fs.readFileSync(PATH_TO_CSR)
// };

// if (!PATH_TO_KEY || !PATH_TO_CERT || !PATH_TO_CSR) {
//     console.error('No se ha encontrado la ruta al certificado o la clave privada');
// }

// const HTTPS_SERVER_IP = process.env.HTTPS_SERVER_IP || 'localhost';
// const HTTPS_SERVER_PORT = process.env.HTTPS_SERVER_PORT || 8998;

// console.debug('HTTPS_SERVER_IP: ' + HTTPS_SERVER_IP);
// console.debug('HTTPS_SERVER_PORT: ' + HTTPS_SERVER_PORT);

// listRoutes(app, 'https', HTTPS_SERVER_IP, HTTPS_SERVER_PORT);

// const httpsServer = https.createServer(credentials,app
//     ).listen(HTTPS_SERVER_PORT, HTTPS_SERVER_IP, () => {
//         console.log(`
//             Servidor inicializado en https://${HTTPS_SERVER_IP}:${HTTPS_SERVER_PORT}
//         `);
// });

console.info("Inicializando WebSocket server");
const wss = new WebSocket.Server({ server: httpServer });

const clients = new Map();
wss.on('connection', (ws) => {
    console.info("[websocketOnConnection] Nuevo usuario websocket");

    const DATA = {
        id:uuidv4() ,
        color: Math.floor(Math.random() * 360)
    };
    
    console.debug('data:', JSON.stringify(DATA));

    console.info("añadiendo cliente")
    clients.set(ws, DATA);

    console.info("enviando mensaje de bienvenida");
    ws.send(JSON.stringify({
        action: "message",
        data: "Bienvenido nuevo cliente!, tu id es: " + DATA.id
    }));

    ws.on('message', (messageAsString) => {
        const message = JSON.parse(messageAsString);
        const metadata = clients.get(ws);

        message.sender = metadata.id;
        message.color = metadata.color;
        const outbound = JSON.stringify(message);

        if (clients) {
            [...clients.keys()].forEach((c) => {
                c.send(outbound);
            });
        }
    });

    ws.on("close", () => {
        clients.delete(ws);
    });
});
exports.clients = clients;

// Discord
const discordClient = new Client({
    restTimeOffset: 0,
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
    ],
});

require('./discord/index')(discordClient);
let guildMembers = [];
discordClient.on('ready', () => {
    const SERVER_ID = process.env.DAILY_GUILD_ID;
    guild = discordClient.guilds.cache.get(SERVER_ID);

    guild.members.fetch().then((members) => {
        guildMembers = members;
    });
});

exports.guildMembers = guildMembers;

// module.exports = {
//     clients: clients,
//     discordClient: discordClient
// };