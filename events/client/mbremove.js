const { ROLES, CHANNELS } = require('../../server-config.json')

module.exports = {
    name: 'mbremove',
    async execute(message, Discord) {
        let role = await message.guild.roles.fetch(ROLES.GOD_MB);
        let mbChannel = await message.guild.channels.fetch(CHANNELS.SEND_MBLIST);

        membersList = [];
        userIds = role.members.map(user => user.id)
        for (let user of userIds) {
            let member = await message.guild.members.fetch(user)
            membersList.push(member)
        }

        message.channel.send(`Locked <#${mbChannel.id}>`)
        message.channel.send(`Removing **${role.name}** from **${membersList.length} users**.\n**ETA:** ${membersList.length*0.5}s`)
        
        //Lock mb channel
        mbChannel.permissionOverwrites.edit(interaction.guild.id, {
            SEND_MESSAGES: false,
        });

        //Remove role from users
        let i=0;
        for (let user of membersList) {
            i++;
            setTimeout(() => {
                user.roles.remove(role.id)
            }, i*500);
        }

        setTimeout(() => {
            message.channel.send(`Successfully removed **${role.name}** from all the users.`);
        }, membersList.length*0.5*1000);
    }
}