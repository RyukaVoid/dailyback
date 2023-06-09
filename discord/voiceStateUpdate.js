const clients = require("../app");

const { pool } = require('../dbConnector');

require('dotenv').config();

module.exports = async function(oldState, newState) {
    console.info("Inicio VoiceStateUpdate");
    console.debug("oldState", oldState.channelId);
    console.debug("newState", newState.channelId);
    console.debug("env", process.env.DAILY_CHANNEL_ID);

    if (oldState.channelId !== null && newState.channelId !== null) {
        if (oldState.channelId !== process.env.DAILY_CHANNEL_ID ||
                newState.channelId !== process.env.DAILY_CHANNEL_ID) {
            console.info("entreif no es daily");
            return;
        }
    }

    if(oldState.channelId === null) {
        console.info('un usuario se ha unido al canal daily')
        console.debug('usuario:', oldState.member.user.id,
            oldState.member.user.username);

        const apsider = await archiveApsider(pool, 0, oldState.member.user.id);
        [...clients.keys()].forEach((c) => {
            c.send(JSON.stringify({
                action: "user-joined",
                apsider: apsider
            }));
        });

    } else if (newState.channelId === null) {
        console.info('un usuario ha dejado el canal daily')
        console.debug('usuario:', newState.member.user.id,
            newState.member.user.username);

        const apsider = await archiveApsider(pool, 1, newState.member.user.id);
        [...clients.keys()].forEach((c) => {
            c.send(JSON.stringify({
                action: "user-left",
                apsider: apsider
            }));
        });
    }
    console.info("fin VoiceStateUpdate");
}

async function archiveApsider(pool, state, user_id, callback) {
    const updateResult = await pool.query(
        "UPDATE apsiders SET archived = ? WHERE id = ?",
        [state,user_id]
    );
    console.debug("usuario archivado", updateResult);
    
    const selectResult = await pool.query(
        "SELECT * FROM apsiders WHERE id = ?",
        [user_id]
    );
    console.debug("usuario obtenido", selectResult);
    return selectResult[0];
}