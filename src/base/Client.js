const { Client } = require('discord.js-selfbot-v13');
const fs = require('fs');
const { sep } = require('path');
const path = require('path');

module.exports = class Farmer extends Client {
    constructor() {
        super({ DMSync: false, checkUpdate: false, patchVoice: false });

        this.config = null;
        this.lastAction = '';
        this.queue = [];
    }

    /**
     * @returns {void}
     */
    async getSettings() {
        if(!fs.existsSync(path.join(process.cwd(), 'settings.json'))) {
            fs.writeFileSync(path.join(process.cwd(), 'settings.json'), JSON.stringify({ token: 'ODA0MDM5NTAyODU4OTQ0NTM0.G4n5-n.1WXWFoiXY7jZPnL0F1eIB65XWuLOMwlq0xztpQ', channelId: '895026679104290856', webhookURL: 'https://discordapp.com/api/webhooks/1059459821738397816/DqAlJrai-lf6-VDIVio-9Bhqry6C5rZS1LhGAk0gEhVPqbNwF0lOmDKO-tU126uYSSz4', safe: true }, null, 4));
            throw `Settings created at ${process.cwd()}${sep}settings.json`;
        } else {
            this.config = require(path.join(process.cwd(), 'settings.json'));
            return;
        }
    }

    async start() {
        this.getSettings();
        await this.login(this.config.token);
        this.channel = await this.channels.fetch(this.config.channelId);
    }
}
