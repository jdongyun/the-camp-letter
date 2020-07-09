import schedule from 'node-schedule';
import Send from './Send';

(async() => {
    if(process.env.NODE_ENV === 'debug') {
        await Send();
    } else {
        schedule.scheduleJob('0 0,15 * * *', async () => {
            await Send();
        });
    }
})();