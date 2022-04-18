const { prefix } = require('../../bot-config.json');
const fs = require('fs');

module.exports = {
    name: 'updateMb',
    async execute(client, guild, Discord) {
        const serverData = await JSON.parse(fs.readFileSync('./server-data.json'));

        let emojiNumbers = [':one:', ':two:', ':three:', ':four:', ':five:', ':six:', ':seven:', ':eight:', ':nine:', ':keycap_ten:']
        
        const listEmbed = new Discord.MessageEmbed()
            .setTitle(`🐉 ${serverData.MINIBOSS_LIST.LOCKED?'LOCKED':'UNLOCKED'} MINIBOSS LIST 🐉`)
            .setColor(serverData.MINIBOSS_LIST.LOCKED?'#ed4245':'#3ba55c')
            .setFooter({text: 'Last interaction'})
            .setTimestamp();

        //Embed description
        let embedDescription = 'Welcome to '+guild.name+' miniboss list!\n\n**INSTRUCTIONS**\n🟢 To join write `'+prefix+'mb in <level>` Ex. `'+prefix+'mb in 38`\n🔴 To leave write `'+prefix+'mb leave` \n\n**LISTED:**\n';

        for (let index = 0; index < serverData.MINIBOSS_LIST.USERS_ON_LIST.length; index++) {
            embedDescription = embedDescription + `${emojiNumbers[0]} <@${serverData.MINIBOSS_LIST.USERS_ON_LIST[index].userId}> \`${serverData.MINIBOSS_LIST.USERS_ON_LIST[index].level}\`\n`
            emojiNumbers.splice(0,1);
        }

        for (let emoji of emojiNumbers) {
            embedDescription = embedDescription + `${emoji} ---\n`
        }

        listEmbed.setDescription(embedDescription);
        let embedChannel = await guild.channels.fetch(serverData.MINIBOSS_LIST.CHANNEL)
        let embedMessage = await embedChannel.messages.fetch(serverData.MINIBOSS_LIST.MESSAGE).catch(()=>embedChannel.send(`⚠️ Error, I was not able to find the list message, send a new one using \`${prefix}newlist\`.`));

        await embedMessage.edit({embeds:[listEmbed]});
        if(serverData.MINIBOSS_LIST.USERS_ON_LIST.length == 10) client.emit('sendmblist', client, guild, Discord);
    }
}