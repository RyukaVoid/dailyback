module.exports = function (guild, channel) {
    const conn = require('../../dbConnector');

    conn.beginTransaction(function (err) {
        if (err) {
            throw err;
        }

        guild.members
            .fetch()
            .then((members) =>
                members.forEach((member) => {
                    console.log(member);
                    const user = member.user;
                    if (user.bot === true) return;

                    const nickname = member.nickname === null ? user.username : member.nickname;
                    const id = user.id;
                    const email = get_email(nickname);
                    const avatar = get_avatar(nickname);
                    console.log("==============");
                    console.log("id: ", id);
                    console.log("email: ", email);
                    console.log("avatar: ", avatar);
                    console.log("==============");

                    const query = `
                        INSERT INTO apsiders (id, name, email, avatar, assisted, mandated, archived)
                        VALUES (?, ?, ?, ?, ?, ?, ?) 
                        ON DUPLICATE KEY UPDATE 
                            name=VALUES(name),
                            email=VALUES(email),
                            avatar=VALUES(avatar)
                        `;
                        conn.query(
                            query,
                            [
                                id,
                                nickname,
                                email,
                                avatar,
                                0,
                                0,
                                1
                            ],
                            function (err, result) {
                        if (err) {
                            conn.rollback(function () {
                                throw err;
                            });
                        }
                    });
                }),
            );

            conn.commit(function (err) {
            if (err) {
                conn.rollback(function () {
                    throw err;
                });
            }
            console.log('success!');
            channel.send('Usuarios Sincronizados Correctamente!');
        });
    });

}


function get_email(nickname) {
    console.log("get_email", nickname);
    const full_name_arr = nickname.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(' ');

    return full_name_arr[0][0] + full_name_arr[full_name_arr.length - 1] + '@apside.cl'
}

function get_avatar(nickname) {
    console.log("get_avatar", nickname);
    const full_name_arr = nickname.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(' ');

    return full_name_arr[0][0] + full_name_arr[full_name_arr.length - 1] + '-apside.jpg'
}