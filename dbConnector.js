const mysql = require('mysql');

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    port: "3306",
    database: "dailyapside"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to bd mysql!");
});

module.exports = con;