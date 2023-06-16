var { guildMembers } = require("../../app");
const { pool } = require('../../dbConnector');
const express = require("express");
const router = express.Router();
require('dotenv').config('../../.env');

router.get("/get-apsiders-discord", async (req, res, next) => {
    console.info("Inicio get-apsiders-discord");
    console.debug("guildMembers",guildMembers);

    const notAdded = req.query.notAdded || false;
    console.debug('notAdded: ' + notAdded);

    const SERVER_ID = process.env.DAILY_GUILD_ID;
    console.debug('SERVER_ID: ' + SERVER_ID);

    console.debug('members: ' + members);
    let members;

    if (notAdded) {
        console.info('Filtrando miembros no añadidos');

        let membersAddedIds;
        try{
            const [membersAdded] = await pool.query('SELECT id FROM apsiders');
            console.debug('membersAdded: ' + membersAdded);
            membersAddedIds = membersAdded.map(member => member.id);

        } catch (err) {
            console.error(`Error al obtener apsiders: ${err.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al obtener apsiders.'
            });
        }
        console.debug('membersAddedIds: ' + membersAddedIds);

        members = guildMembers.filter(
            member => !membersAddedIds.includes(member.id));
    }

    return res.status(200).json({
        status: "success",
        length: members?.length,
        result: members
    });
});

module.exports = router;
