const clients = require("../app");

module.exports = function(oldState, newState) {
    console.log("--------INICIO--------");
    console.log("oldState", oldState.channelId);
    console.log("newState", newState.channelId);
    console.log("env", process.env.DAILY_CHANNEL_ID);

    if (oldState.channelId !== null){
        if (oldState.channelId !== process.env.DAILY_CHANNEL_ID){
            console.log("entreif");
            return;
        }
    }

    if (newState.channelId !== null){
        if (newState.channelId !== process.env.DAILY_CHANNEL_ID){
            console.log("entreif");
            return;
        }
    }

    // channel id 1009808290991054982
    // use the .channelID property (.voice doesn't exist)
    const conn = require('../dbConnector');

    if(oldState.channelId === null) {
        console.log('a user joined!')
        console.log('user:', oldState.member.user.id);

        archiveApsider(conn, 0, oldState.member.user.id, function(apsider){
            [...clients.keys()].forEach((c) => {
                c.send(JSON.stringify({
                    action: "user-joined",
                    apsider: apsider
                }));
            });
        });

    } else if (newState.channelId === null) {
        console.log('a user left!')
        console.log('user:', newState.member.user.id);

        archiveApsider(conn, 1, newState.member.user.id,function(apsider){
            [...clients.keys()].forEach((c) => {
                c.send(JSON.stringify({
                    action: "user-left",
                    apsider: apsider
                }));
            });
        });

    }
    console.log("--------FIN--------");
}

function archiveApsider(conn, state, user_id, callback) {
    conn.query(
        "UPDATE apsiders SET archived = ? WHERE id = ?",
        [
            state,
            user_id
        ],
        (err, result) => {
            if (err)
                throw err;
            console.log("result", result);
        }
    );

    conn.query(
        "SELECT * FROM apsiders WHERE id = ?",
        [
            user_id
        ],
        (err, result) => {
            if (err)
                throw err;
            console.log("result", result);
            return callback(result[0]);
        }
    );
}