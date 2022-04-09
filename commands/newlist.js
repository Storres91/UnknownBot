const { hasAnyOfRoles } = require('../utils/permsManager.js')
const { prefix } = require('../bot-config.json')
const { ROLES } = require('../server-config.json')
const { jsonReader } = require('../utils/jsonManipulation.js')
const fs = require('fs')

module.exports = {
    name: 'newlist',
    description: 'Sends a new embed mb list',
    aliases: [''],
    async execute(client, message, args, Discord) {
        if (!hasAnyOfRoles(message, [ROLES.STAFF])) return message.channel.send('You are not allowed to use this command.')

        const listEmbed = new Discord.MessageEmbed()
            .setTitle('🐉 MINIBOSS LIST 🐉')
            .setDescription('Welcome to '+message.guild.name+' miniboss list!\n\n**INSTRUCTIONS**\n🟢 To join write `'+prefix+'mblist join <level>` Ex. `'+prefix+'mblist join 38`\n🔴 To leave write `'+prefix+'mblist leave` \n\n**LISTED:**\n:one: ---\n:two: ---\n:three: ---\n:four: ---\n:five: ---\n:six: ---\n:seven: ---\n:eight: ---\n:nine: ---\n:keycap_ten: ---')
            .setColor('#f970f9')
            .setFooter({text: 'Last interaction'})
            .setTimestamp();

        const mbListRow = new Discord.MessageActionRow().addComponents(
            new Discord.MessageButton()
                .setCustomId("clearMbList")
                .setLabel("🔁 CLEAR LIST")
                .setStyle("PRIMARY"));

        let listMessageId;
        await message.channel.send({embeds: [listEmbed], components:[mbListRow]}).then(m => listMessageId = m.id);

        jsonReader('./server-data.json', (err, data) => {
            if (err) console.log(err);
            else {
                data.MINIBOSS_LIST.CHANNEL = message.channel.id;
                data.MINIBOSS_LIST.MESSAGE = listMessageId;
                data.MINIBOSS_LIST.USERS_ON_LIST = [];

                fs.writeFile('./server-data.json', JSON.stringify(data, null, 4), err => {
                    if (err) console.log(err);
                });

            }
        });

        try {
            message.delete(); 
        } catch (error) {
            console.log(error);
        }
    }
}