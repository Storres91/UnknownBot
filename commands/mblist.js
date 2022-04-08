const { prefix } = require('../bot-config.json');
const { jsonReader } = require('../utils/jsonManipulation.js');
const fs = require('fs');
const { ROLES } = require('../server-config.json');
const { hasAnyOfRoles } = require('../utils/permsManager.js');


module.exports = {
    name: 'mblist',
    description: 'Manipulate mb list',
    aliases: [''],
    async execute(client, message, args, Discord) {
        let serverData = JSON.parse(await fs.readFileSync('./server-data.json'));
        if (message.channel.id != serverData.MINIBOSS_LIST.CHANNEL) return
        let userIndex = serverData.MINIBOSS_LIST.USERS_ON_LIST.findIndex(obj => obj.userId == message.author.id);
        

        let emojiNumbers = [':one:', ':two:', ':three:', ':four:', ':five:', ':six:', ':seven:', ':eight:', ':nine:', ':keycap_ten:']
        
        const listEmbed = new Discord.MessageEmbed()
            .setTitle('🐉 MINIBOSS LIST 🐉')
            .setColor('#f970f9')
            .setFooter({text: 'Last interaction'})
            .setTimestamp();

        switch (args[0]) {
            case 'join':
                if ( userIndex > -1) {
                    try {
                        message.delete(); 
                    } catch (error) {
                        console.log(error);
                    }
                    return;
                }

                if (!args[1]) {
                    message.member.send(`🔴 ERROR\nYou weren\'t able to join the list in **${message.guild.name}** because you didn't **specify your level**. \nEx: \`${prefix}${this.name} join <level>\``);
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
                        data.MINIBOSS_LIST.USERS_ON_LIST.push({userId: message.author.id, level: args[1]});
        
                        fs.writeFile('./server-data.json', JSON.stringify(data, null, 4), err => {
                            if (err) console.log(err);
                        });
        
                    }
                });
                break;

            case 'leave':
                if ( userIndex > -1) {
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
        
            default:
                return
        }


        //Embed description
        let embedDescription = 'Welcome to '+message.guild.name+' miniboss list!\n\n**INSTRUCTIONS**\n🟢 To join write `'+prefix+'mblist join <level>` Ex. `'+prefix+'mblist join 38`\n🔴 To leave write `'+prefix+'mblist leave` \n\n**LISTED:**\n';

        for (let index = 0; index < serverData.MINIBOSS_LIST.USERS_ON_LIST.length; index++) {
            embedDescription = embedDescription + `${emojiNumbers[index]} <@${await serverData.MINIBOSS_LIST.USERS_ON_LIST[index].userId}> \`${await serverData.MINIBOSS_LIST.USERS_ON_LIST[index].level}\`\n`
            emojiNumbers.splice(0,1);
        }
        embedDescription = embedDescription + `${emojiNumbers[0]} <@${message.author.id}> \`${args[1]}\`\n`
        emojiNumbers.splice(0,1);

        for (let emoji of emojiNumbers) {
            embedDescription = embedDescription + `${emoji} ---\n`
        }

        listEmbed.setDescription(embedDescription);
        let embedChannel = await message.guild.channels.fetch(serverData.MINIBOSS_LIST.CHANNEL)
        let embedMessage = await embedChannel.messages.fetch(serverData.MINIBOSS_LIST.MESSAGE).catch(()=>message.channel.send(`⚠️ Error, I was not able to find the list message, send a new one using \`${prefix}newlist\`.`));

        await embedMessage.edit({embeds:[listEmbed]});
        try {
            message.delete(); 
        } catch (error) {
            console.log(error);
        }
    }
}