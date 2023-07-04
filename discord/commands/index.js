const joinChannelCommand = require('./joinChannelCommand');
const readyCommand = require('./readyCommand');
const notReadyCommand = require('./notReadyCommand');
const statusCommand = require('./statusCommand');
const commandsCommand = require('./commandsCommand');

module.exports = function(message) {
    console.info("Inicio commands");
    console.log("message: ", message);

    const DAILY_CHANNEL_ID = process.env.DAILY_CHANNEL_ID || 0;

    if (message === undefined || message === null || DAILY_CHANNEL_ID === 0) return;
    if (message.channelId !== DAILY_CHANNEL_ID) return;
    if(message.content[0] !== "!") return;

    const args = message.content.slice(1).substring(
        message.content.indexOf(' ')).split(';');
    const command = message.content.slice(1).split(' ').splice(0, 1)[0];

    console.log("args: ", args);
    console.log("command: ", command);

    switch (command){
        case "join-channel":
            joinChannelCommand(
                this.channels.cache.get(process.env.DAILY_CHANNEL_ID
            ));
            break;
        case "ready":
            readyCommand(
                message.author,
                this.channels.cache.get(DAILY_CHANNEL_ID)
            );
            break;
        case "not-ready":
            notReadyCommand(
                message.author,
                this.channels.cache.get(DAILY_CHANNEL_ID)
            );
            break;
        case "status":
            statusCommand(
                this.channels.cache.get(DAILY_CHANNEL_ID)
            );
            break;
        case "commands":
            commandsCommand(
                this.channels.cache.get(DAILY_CHANNEL_ID)
            )
            break;
        case "reset-assisted":
            resetAssistedCommand(
                this.channels.cache.get(DAILY_CHANNEL_ID)
            );
            break;
        default:
            channel.send(`
                Comando no encontrado. 
                Trata de escribir **!commands** para obtener un listado 
                de los comandos disponibles.")
            `);
            break;
    }
}