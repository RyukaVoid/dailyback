function notifyAllClients(data) {
    const { clients } = require("./app");
    if (clients) {
        console.info("Enviando mensaje a los clientes");
        [...clients.keys()].forEach((c) => {
            c.send(data);
        });
    }
}

module.exports = notifyAllClients;
