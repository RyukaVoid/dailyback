const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = function (channel) {
    console.info("Inicio joinChannelCommand");
    if (!channel) return console.error("El canal no existe!");

    joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
    });
    console.info("Fin joinChannelCommand");
}