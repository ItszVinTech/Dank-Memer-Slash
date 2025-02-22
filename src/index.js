console.clear();

const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`app listening at http://localhost:${port}`));

const Client = require('./base/Client');
const { startSimpleFarm } = require('./util/farm');
const alert = require('./util/util').alert;
let LastError = Date.now();

const client = new Client();
(async () => {
    await require('./util/checkUpdate')();
    require('./util/antiCrash')();
    await client.start();
})();

client.on('messageCreate', async (message) => {
    try {
        if(![client.user.id, '270904126974590976'].includes(message.author.id)) return;
        if(message.flags.has("EPHEMERAL")) {
            if(message.embeds[0].description.includes('You have an ongoing command running.')) {
                if(Date.now() < (LastError + 15000)) return;
                const date = new Date().toLocaleTimeString();
                await alert(`Somehow the bot didn't click a button at ${date}`);
                return;
            }
        }
        if(message.channel.type == 'DM') require('./handlers/DMHandler')(message);
        // Disabled temporarily for testing purposes to be enabled again later for prod
        if(client.lastAction == '') return;
        if(message.embeds.length == 0) return;
        await require('./handlers/messageHandler')(message, client.lastAction, client);
    } catch (error) {
        console.error(error);
    }
});

client.on('ready', async () => {
    console.log(`${client.user.tag} is ready to farm`);
    const channel = await client.channels.fetch(client.config.channelId, { force: false });
    await startSimpleFarm(client, channel);

    setInterval(async () => {
        if (client.queue.length > 0) {
            let data = client.queue[0];
            client.lastAction = data.action;
            await client.channel.sendSlash('270904126974590976', data.command);
            let shift = await client.queue.shift();
            if (Array.isArray(shift))
                client.queue = shift;
            else
                client.queue = [];
        }
    }, 5000);
});
