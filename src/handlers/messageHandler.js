const { Message } = require('discord.js-selfbot-v13');
const { random } = require('../util/util')
const { setTimeout: sleep } = require('node:timers/promises');

/**
 * @param {Message} message The message
 * @param {string} action The action that this message was derived from
 */

module.exports = async (message, action, client) => {
    client.lastAction = '';
    const embed = message.embeds[0];
    const components = message.components;
    let len = message.components.length;
    if(!embed?.description) return; // Very crude way to fix this problem need to think of a better fix
    let item = embed.description.includes('**') ? embed.description.split('**')[1].split(">")[1] : null;
    if(typeof item == 'string') item = item.slice(1);
    else item = false;

    // For debugging purposes only, to be disabled in prod
    action = 'highlow'

    switch(action.toLowerCase()) {
        case 'crime':
            if(!len) break;
            return await message.clickButton(components[0].components[random(components[0].components.length)].customId)
            
        case 'postmemes':
            if(!len) break;
            console.log(len)
            await message.selectMenu(components[0].components[0].customId, [components[0].components[0].options[random(components[0].components[0].options.length)].value.toString()])
            await message.selectMenu(components[1].components[0].customId, [components[1].components[0].options[random(components[1].components[0].options.length)].value.toString()])

            // Shitty solution for getting button to work
            // Need to click button after its activated
            // Activates after selection of menu but before Message#clickButton is invoked
            // Depends on latency
            // tested with 200ms latency
            await sleep(200)
            return await message.clickButton(message.components[2].components[0].customId)

        case 'highlow':
            const number = message.embeds[0].description.match(/\*\*(\d{1,3})\*\*/)[1]
            let guess
            if(number > 50) guess = 0
            if(number <= 50) guess = 2 
            return await message.clickButton(components[0].components[guess].customId)

        case '': break;
        
        default:
            if(item) {
                await message.channel.sendSlash('270904126974590976', 'sell', item);
                await message.channel.sendSlash('270904126974590976', 'deposit', 'all');
                break;
            }
            break;
    }
}
