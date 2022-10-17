const cron = require('node-cron');
// Schedule tasks to be run on the server.
cron.schedule('0 0 * * *', function () {
  const conn = require('../dbConnector');
  console.log('running a task every day');
  conn.query("UPDATE apsiders SET assisted = ?", 0, (err, result) => {
    if (err) throw err;
    console.log(result);
  })
});