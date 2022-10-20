module.exports = function (channel) {
    const conn = require('../../dbConnector');

    conn.query(
        "SELECT name, assisted, mandated from apsiders WHERE archived = ?",
        0,
        (err, result) => {
            if (err) throw err;
            let response = ""
            if (result.length > 0){
                const assisted = result.filter(function(el){return el.assisted === 1})
                const notAssisted = result.filter(function(el){return el.assisted === 0})

                response += `__Apsiders en daily:__ **${result.length}**\n\n`

                response += `========================= \n`
                response += `:x: Apsiders que no han presentado **${notAssisted.length}**\n\n`
                response += notAssisted.map((i) => `- ${i.name} `).join("\n")
                response += `\n=========================\n`

                response += `=========================\n`
                response += `:white_check_mark: Apsiders que presentaron **${assisted.length}**\n\n`
                response += assisted.map((i) => `- ${i.name}`).join("\n")
                response += `\n=========================\n`

            }else{
                response = "No hay usuarios en la daily! :("
            }
            channel.send(response);
        }
    );
}