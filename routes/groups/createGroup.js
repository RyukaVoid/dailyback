const express = require("express");
const router = express.Router();
const { pool } = require('../../dbConnector');
var app = require("../../app");
const { ChannelType } = require('discord.js');


router.post("/group", async (req, res, next) => {
    console.info("Inicio create-group");

    const groupName = req.body.name;
    const apsidersToAdd = req.body.apsiders

    console.debug("GroupName:", groupName);
    console.debug("apsidersToAdd:", JSON.stringify(apsidersToAdd));

    if (!groupName || apsidersToAdd.length === 0) {
        console.error("group name esta vacio o apsiders to add esta vacio")
        return res.status(200).json({ 
            status: 'error',
            message: 'group name esta vacio o apsiders to add esta vacio.' 
        });
    }

    sql_validate = "SELECT id from grupos WHERE name LIKE ?";
    [rows] = await pool.query(sql_validate, [groupName]);

    if (rows.length > 0) {
        console.error("El grupo  ya existe")
        return res.status(200).json({ 
            status: 'error',
            message: 'El grupo ya existe.' 
        });
    }

    // creando canal
    let channel
    try {
        const discordClient = app.discordClient;
        const SERVER_ID = process.env.DAILY_GUILD_ID;
        console.debug('SERVER_ID: ' + SERVER_ID);

        const guild = discordClient.guilds.cache.get(SERVER_ID);

        const DAILY_CHANNELS_CATEGORY_ID = 
            process.env.DAILY_CHANNELS_CATEGORY_ID;
        const channelCreated = await guild.channels.create({
            name: groupName,
            parent: guild.channels.cache.get(DAILY_CHANNELS_CATEGORY_ID),
            type: ChannelType.GuildVoice,
        })

        channel = channelCreated;

        console.log("------ channel id:", channel.id)
    } catch (err) {
        console.error("Error al crear grupo", err)
        if (channel) {
            console.info("eliminando canal...");
            channel.delete()
        }
        return res.status(200).json({ 
            status: 'error',
            message: 'Error al crear grupo.' 
        });
    }

    const query = `INSERT INTO grupos(name, channel_id) VALUES (:name, :channel_id);`;
    console.debug('query: ' + query);

    const connection = await pool.getConnection();
    let groupDatabaseId;
    try {
        await connection.beginTransaction();

        const params = {
            "name": groupName + '',
            "channel_id": channel.id + ''
        }

        const [result] = await connection.query({
            sql: query,
            values: params,
            namedPlaceholders: true
        });

        console.info(`${result.affectedRows} fila(s) afectadas(s)`);


        if (apsidersToAdd.length > 0) {
            console.log("añadiendo apsiders al grupo")

            console.log("resutl:", result.insertId)
            groupDatabaseId = result.insertId;

            var sql_update = `UPDATE apsiders SET grupo_id = :grupo_id 
                WHERE id = :id`;

            for (const apsiderToAdd of apsidersToAdd){
                const params = {
                    id: apsiderToAdd.id,
                    grupo_id: groupDatabaseId
                }

                const [rows] = await connection.query({
                    sql: sql_update,
                    values: params,
                    namedPlaceholders: true
                })

                console.info(`${rows.affectedRows} fila(s) afectadas(s)`);   
            }
            connection.commit();
            console.info("Fin añadir apsiders al grupo");
        }
    } catch (err) {
        console.error(`Error al obtener grupos: ${err.message}`);
        if (channel) {
            console.info("eliminando canal...");
            channel.delete()
        }
        return res.status(200).json({ 
            status: 'error',
            message: 'Error al crear grupos.' 
        });
    }


    console.info("Fin create-group");
    return res.status(200).json({
        status: "success",
        data: {
            id: groupDatabaseId,
            name: groupName,
            channelId: channel.id,
            apsiders: apsidersToAdd
        }
    });
});

module.exports = router;