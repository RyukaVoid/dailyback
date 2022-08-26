const cron = require('node-cron');
const conn = require('../dbConnector');
// Schedule tasks to be run on the server.
cron.schedule('0 0 * * *', function () {
  console.log('running a task every minute');
  conn.query("UPDATE apsiders SET assisted = ?", 0, (err, result) => {
    if (err) throw err;
    console.log(result);
  })
});