const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config({
    path: './.env'
});
const {
    Client,
    GatewayIntentBits
} = require('discord.js');
// Set path to .env file

// Set path to .env file
dotenv.config({
    path: './.env'
});

const app = express();
app.use(express.static(__dirname + '/public'));

const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({
    server
});

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// rutas
require('./startup/routes')(app);

//start our server
server.listen(process.env.PORT || 8999, () => {
    console.log(`Server started on port http://localhost:${server.address().port}`);
});

// Discord
const client = new Client({
    restTimeOffset: 0,
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
    ],
});

require('./discord/index')(client);