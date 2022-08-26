const voiceStateUpdate = require('./voiceStateUpdate')
const commands = require('./commands/index')


module.exports = function(client) {
    
    client.on('voiceStateUpdate', voiceStateUpdate)
    client.on('messageCreate', commands)
    
    // Login to Discord with your client's token
    client.login(process.env.BOT_TOKEN);
}
