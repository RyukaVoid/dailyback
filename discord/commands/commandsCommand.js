module.exports = function (channel) {
    channel.send('__Listado de comandos__\n');


    const commandList = `
- **!sync-users** Sincroniza todos los usuarios en el servidor de discord tomando sus apodos dentro del servidor y generandolos en la base de datos con sus datos correspondientes. (Importante saber que actualmente la app genera el correo tomando la primera letra del NOMBRE y el APELLIDO) EJ: diego ramirez -> dramirez@apside.cl.\n
- **!join-channel** Entra el bot a la daily (No tiene ninguna funcion en particular todavia).\n
- **!ready** Coloca a apsider que ejecutó el comando en la zona de "Presentado (parte derecha de la pagina web)."\n
- **!not-ready** Coloca a apsider que ejecutó el comando en la zona de "no presentados (parte izquierda de la pagina web)."\n
- **!status** Muestra información actual de el estado de la daily.\n
- **!commands** Muestra un listado de los comandos.\n
    `

    channel.send(commandList);
}