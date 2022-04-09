const { hasAnyOfRoles } = require('../utils/permsManager.js');
const { transformToId } = require('../utils/targets.js');
const { prefix } = require('../bot-config.json');
const { ROLES } = require('../server-config.json')

module.exports = {
    name: 'removerole',
    description: 'Removes a role from target',
    aliases: ['roleremove',],
    async execute(client, message, args, Discord) {
        if (!hasAnyOfRoles(message, [ROLES.STAFF])) return message.channel.send('You are not allowed to use this command.');
        if (args.length < 2) return message.channel.send(`Use this command properly! \n**Correct usage:** \`${prefix}${this.name} <role> <user>\``);

        const roleId = transformToId(args.slice(-1).join(''));
        let role, membersList=[];

        //Check if both role and user are valid
        role = await message.guild.roles.fetch(roleId).catch(()=>null);
        if (!role) return message.channel.send(`\`${args.slice(-1)}\` is not a valid role.`)

        for (let user of args.slice(0,-1)) {
            let userId = transformToId(user);
            user = await message.guild.members.fetch(userId).catch(()=>null);
            if (!user) return message.channel.send(`\`${user}\` is not a valid user.`);

            membersList.push(user);
        }

        message.channel.send(`Removing **${role.name}** from **${membersList.length} users**.\n**ETA:** ${membersList.length*0.5}s`)
        //Remove role from user
        let i;
        for (let user of membersList) {
            i++;
            setTimeout(() => {
                user.roles.remove(roleId)
            }, i*500);
        }

        setTimeout(() => {
            message.channel.send(`Successfully removed **${role.name}** from those users.`);
        }, membersList.length*0.5*1000);
        
    }
}