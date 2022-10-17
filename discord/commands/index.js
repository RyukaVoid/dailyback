const joinChannelCommand = require('./joinChannelCommand');
const syncUsersCommand = require('./syncUsersCommand');
const readyCommand = require('./readyCommand');
const notReadyCommand = require('./notReadyCommand');
const statusCommand = require('./statusCommand');
const commandsCommand = require('./commandsCommand');

module.exports = function(message) {
    
    if (message === undefined || message === null) return;
    if (message.channelId !== process.env.DAILY_COMMAND_CHANNEL_ID) return;
    
    console.log("message: ", process.env.DAILY_COMMAND_CHANNEL_ID);
    if(message.content[0] !== "!") return;

    const args = message.content.slice(1).substring(message.content.indexOf(' ')).split(';');
    const command = message.content.slice(1).split(' ').splice(0, 1)[0];

    console.log("args: ", args);
    console.log("command: ", command);

    switch (command){
        case "sync-users":
            syncUsersCommand(
                this.guilds.cache.get(process.env.DAILY_GUILD_ID),
                this.channels.cache.get(process.env.DAILY_COMMAND_CHANNEL_ID)
            );
            break;
        case "join-channel":
            joinChannelCommand(this.channels.cache.get(process.env.DAILY_CHANNEL_ID));
            break;
        case "ready":
            readyCommand(
                message.author,
                this.channels.cache.get(process.env.DAILY_COMMAND_CHANNEL_ID)
            );
            break;
        case "not-ready":
            notReadyCommand(
                message.author,
                this.channels.cache.get(process.env.DAILY_COMMAND_CHANNEL_ID)
            );
            break;
        case "status":
            statusCommand(
                this.channels.cache.get(process.env.DAILY_COMMAND_CHANNEL_ID)
            );
            break;
        case "commands":
            commandsCommand(
                this.channels.cache.get(process.env.DAILY_COMMAND_CHANNEL_ID)
            )
            break;
        default:
            const channel = this.channels.cache.get(process.env.DAILY_COMMAND_CHANNEL_ID)
            channel.send("Comando no encontrado. Trata de escribir **!commands** para obtener un listado de los comandos disponibles.")
            break;
    }
}