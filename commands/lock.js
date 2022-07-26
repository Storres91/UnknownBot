const { hasAnyOfRoles } = require('../utils/permsManager');
const serverData = require('../server-config.json');
const { transformToId } = require('../utils/targets.js');

module.exports = {
    name: 'lock',
    description: 'Locks a channel to a specific role',
    aliases: [''],
    async execute(client, message, args, Discord, server) {
        if (!hasAnyOfRoles(message, [serverData.ROLES.HEAD_STAFF, serverData.ROLES.SENIOR_STAFF, serverData.ROLES.JUNIOR_STAFF,])) return message.channel.send('You are not allowed to use this command!');
        let role;
        if (args[1]) {
            role = await message.guild.roles.fetch(transformToId(args[1])).catch(() => null);
            if (!role) return message.channel.send(`\`${args[1]}\` is not a valid role.`)
        } else {
            role = {
                id: message.guild.id
            };
        }

        if (!args[0]) {
            message.channel.permissionOverwrites.edit(role.id, {
                SEND_MESSAGES: false
            })

            message.channel.send('Successfully locked this channel.')
        } else {

            if (args[0] == 'server') {
                const channels = await message.guild.channels.cache;

                channels.forEach(ch => {
                    if (ch.type == "GUILD_TEXT")
                        ch.permissionOverwrites.edit(role.id, {
                            SEND_MESSAGES: false
                        })
                })
                message.channel.send('Successfully locked server for this role.')

            } else {
                const channel = await message.guild.channels.fetch(transformToId(args[0])).catch(() => null);
                if (!channel) return message.channel.send(`${args[0]} is not a valid channel.`)

                channel.permissionOverwrites.edit(role.id, {
                    SEND_MESSAGES: false
                });

                message.channel.send('Successfully locked ' + args[0] + ' for this role.')
            }
        }
    }
}