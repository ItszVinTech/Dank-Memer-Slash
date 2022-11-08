const { WebhookClient } = require('discord.js-selfbot-v13');
const times = require('./times');

function random(max) {
    return Math.floor(Math.random() * max);
}

async function alert(msg) {
    const webhookURL = require('../settings.json').webhookURL
    const client = new WebhookClient({ url: webhookURL });
    await client.send(msg);
}

times = {
    second: 1000,
    minute: 60000,
    hour: 3600000,
    day: 86400000,
}


module.exports = {
    random: random,
    alert: alert,
    times: times
}
