const { isAllowed } = require('../utils/permsManager.js');
const { transformToId } = require('../utils/targets.js');
const { prefix } = require('../bot-config.json');

module.exports = {
    name: 'removerole',
    description: 'Removes a role from target',
    aliases: ['roleremove',],
    async execute(client, message, args, Discord) {
        if (!isAllowed({message, roles: ['STAFF']})) return message.channel.send('You are not allowed to use this command.');
        if (args.length < 2) return message.channel.send(`Use this command properly! \n**Correct usage:** \`${prefix}${this.name} <role> <user>\``);

        const roleId = transformToId(args[0]);
        const userId = transformToId(args[1]);
        let role, user;

        //Check if both role and user are valid
        role = await message.guild.roles.fetch(roleId).catch(()=>null);
        if (!role) return message.channel.send(`\`${args[0]}\` is not a valid role.`)

        user = await message.guild.members.fetch(userId).catch(()=>null);
        if (!user) return message.channel.send(`\`${args[1]}\` is not a valid user.`)


        //Remove role from user
        user.roles.remove(roleId);
        message.channel.send(`Successfully removed **${role.name}** from **${user.nickname || user.user.username}**.`)
        
    }
}