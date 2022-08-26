const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = function (channel) {
    if (!channel) return console.error("The channel does not exist!");
    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
    });

}