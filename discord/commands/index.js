const joinChannel = require('./joinChannel');
const syncUsers = require('./syncUsers');

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
            syncUsers(this.guilds.cache.get(process.env.DAILY_GUILD_ID), this.channels.cache.get(process.env.DAILY_COMMAND_CHANNEL_ID));
            break;
        case "join-channel":
            joinChannel(this.channels.cache.get(process.env.DAILY_CHANNEL_ID))
            break
        default:
            break;
    }
}