module.exports = function (autor, channel) {
    const conn = require('../../dbConnector');
    const user_id = autor.id

    conn.query(
        "UPDATE apsiders SET assisted = ? WHERE id = ?",
        [
            0,
            user_id
        ],
        (err, result) => {
            if (err) throw err;
            
            // notifica frontend webscokets
            const clients = require("../../app");
            [...clients.keys()].forEach((c) => {
                c.send(JSON.stringify({
                    action: "assisted-updated",
                    data: {
                        id: user_id,
                        assist: 0
                    }
                }));
            });

            channel.send('Ausentado correctamente');
        }
    );

}