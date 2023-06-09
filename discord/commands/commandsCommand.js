module.exports = function (channel) {
    console.info("Inicio commandsCommand");
    channel.send('__Listado de comandos__\n');

    const commandList = `
        - **!sync-users** Desactivado.\n
        - **!join-channel** Entra el bot a la daily
            (No tiene ninguna funcion en particular todavia).\n
        - **!ready** Coloca a apsider que ejecutó
            el comando en la zona de "Presentado 
            (parte derecha de la pagina web)."\n
        - **!not-ready** Coloca a apsider que ejecutó 
            el comando en la zona de "no presentados 
            (parte izquierda de la pagina web)."\n
        - **!status** Muestra información actual 
            de el estado de la daily.\n
        - **!commands** Muestra un listado de los comandos.\n
    `
    console.debug('commandList: ' + commandList);
    
    channel.send(commandList);
    console.info("Fin commandsCommand");
}