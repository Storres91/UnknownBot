const { prefix } = require('../bot-config.json');
const { jsonReader } = require('../utils/jsonManipulation.js');
const { GUILD } = require('../server-config.json')
const fs = require('fs');
const { hasAnyOfRoles } = require('../utils/permsManager');

module.exports = {
    name: 'mb',
    description: 'Manipulate mb list',
    aliases: [''],
    async execute(client, message, args, Discord) {
        let serverData = JSON.parse(await fs.readFileSync('./server-data.json'));
        if (message.channel.id != serverData.MINIBOSS_LIST.CHANNEL) return
        if (serverData.MINIBOSS_LIST.LOCKED) {
            try {
                message.delete(); 
            } catch (error) {
                console.log(error);
            }
            return
        }

        let userIndex = serverData.MINIBOSS_LIST.USERS_ON_LIST.findIndex(obj => obj.userId == message.author.id);

        switch (args[0]) {
            case 'in':
                if ( userIndex > -1 || isNaN(parseInt(args[1]))) {
                    try {
                        message.delete(); 
                    } catch (error) {
                        console.log(error);
                    }
                    return;
                }

                if (!args[1]) {
                    message.member.send(`🔴 **ERROR**\nYou weren\'t able to join the list in **${message.guild.name}** because you didn't **specify your level**. \nEx: \`${prefix}${this.name} in <level>\``);
                    try {
                        message.delete(); 
                    } catch (error) {
                        console.log(error);
                    }
                    return;
                }

                jsonReader('./server-data.json', (err, data) => {
                    if (err) {
                        console.log(err);
                    } else {
                        data.MINIBOSS_LIST.USERS_ON_LIST.push({userId: message.author.id, level: parseInt(args[1])});
        
                        fs.writeFile('./server-data.json', JSON.stringify(data, null, 4), err => {
                            if (err) console.log(err);
                        });
        
                    }
                });

                
                break;

            case 'leave':
                if ( userIndex == -1) {
                    try {
                        message.delete(); 
                    } catch (error) {
                        console.log(error);
                    }
                    return
                }

                jsonReader('./server-data.json', (err, data) => {
                    if (err) console.log(err);
                    else {
                        data.MINIBOSS_LIST.USERS_ON_LIST.splice(userIndex, 1);

        
                        fs.writeFile('./server-data.json', JSON.stringify(data, null, 4), err => {
                            if (err) console.log(err);
                        });
        
                    }
                });

                break;

            case 'done':
                if (!hasAnyOfRoles(message, [serverData.ROLES.HEAD_STAFF, serverData.ROLES.SENIOR_STAFF, serverData.ROLES.JUNIOR_STAFF])) return message.channel.send('You are not allowed to use this command!')
                return client.emit('mbremove', message, Discord);

            default:
                try {
                    message.delete(); 
                } catch (error) {
                    console.log(error);
                }
                return
        }

        try {
            message.delete(); 
        } catch (error) {
            console.log(error);
        }

        let guild = await client.guilds.fetch(GUILD);
        setTimeout(() => {
            client.emit('updateMb', client, guild, Discord);
        }, 600);

        

    }
}