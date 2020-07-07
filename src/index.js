import schedule from 'node-schedule';
import Send from './Send';

(async() => {
    schedule.scheduleJob('0 0,15 * * *', async () => {
        await Send();
    });
})();