var app = require("../../app");
const { pool } = require('../../dbConnector');
const express = require("express");
const router = express.Router();
require('dotenv').config('../../.env');

router.get("/get-apsiders-discord", async (req, res, next) => {
    console.info("Inicio get-apsiders-discord");
    const discordClient = app.discordClient;
    console.log("discordClient",discordClient);

    const SERVER_ID = process.env.DAILY_GUILD_ID;
    console.debug('SERVER_ID: ' + SERVER_ID);

    const guild = discordClient.guilds.cache.get(SERVER_ID);
    let members = await guild.members.fetch();
    members = Array.from(members, ([name, value]) => ({ name, value }));
    members = members.map(member => member.value);

    let membersAddedIds;
    let membersAdded;
    try{
        const [rows] = await pool.query('SELECT * FROM apsiders');
        membersAdded = rows;
        membersAddedIds = rows.map(member => member.id);
        console.debug('membersAdded:', JSON.stringify(membersAddedIds));

    } catch (err) {
        console.error(`Error al obtener apsiders: ${err.message}`);
        return res.status(500).json({
            status: 'error',
            message: 'Error al obtener apsiders.'
        });
    }

    console.info('Filtrando miembros que estan en la base de datos');

    members = members.filter(member => 
        member.guild.id === SERVER_ID && !member.user.bot);
    console.debug('members:', JSON.stringify(members));

    membersClone = JSON.parse(JSON.stringify(members));

    members = members.filter((member) => 
        !membersAddedIds.includes(member.id));
    console.debug('members:', JSON.stringify(members));

    const membersResponse = members.map(member => {
        return {
            id: member.id,
            username: member.nickname || member.displayName,
            avatar: member.user.avatarURL(),
        }
    });

    console.info("fin de get-apsiders-discord");
    return res.status(200).json({
        status: "success",
        notInServer: membersResponse,
        notInServerLength: membersResponse?.length,
        inServer: membersAdded,
        inServerLength: membersAdded?.length,
        membersInDiscordLength: membersClone?.length,
    });
});

module.exports = router;
