const cron = require('node-cron');

const timeZone = 'America/Santiago';

cron.schedule('45 8 * * *', () => {
  console.log('Se ejecuta a las 8:45 AM en Chile');
}, {
  timezone: timeZone
});

cron.schedule('45 9 * * *', () => {
  console.log('Se ejecuta a las 9:45 AM en Chile');
}, {
  timezone: timeZone
});