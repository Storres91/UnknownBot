const { CHANNELS } = require('../../server-config.json');
const { jsonReader } = require('../../utils/jsonManipulation.js');
const fs = require('fs');
const _ = require('lodash');

module.exports = {
    name: 'sendmblist',
    async execute(client, guild, args, Discord) {
        let serverData = JSON.parse(await fs.readFileSync('./server-data.json'));
        let sortedUsers = _.sortBy(serverData.MINIBOSS_LIST.USERS_ON_LIST, 'level').reverse();
        
        let listSendChannel = await guild.channels.fetch(CHANNELS.SEND_MBLIST);
        listSendChannel.send(`**🐉 Miniboss list is ready!**\n${sortedUsers.slice(1).map(user => `<@${user.userId}>`).join(' ')}\n\n**<@${sortedUsers[0].userId}>! LEVEL ${sortedUsers[0].level}** You are the highest level on this list, here's the command for you!\n\`rpg miniboss ${sortedUsers.slice(1).map(user => `<@${user.userId}>`).join(', ')}\``);

        jsonReader('./server-data.json', (err, data) => {
            if (err) console.log(err);
            else {
                data.MINIBOSS_LIST.USERS_ON_LIST = [];

                fs.writeFile('./server-data.json', JSON.stringify(data, null, 4), err => {
                    if (err) console.log(err);
                });

            }
        });

        setTimeout(() => {
            client.emit('updateMb', client, guild, args, Discord);
        }, 600);
    }
}