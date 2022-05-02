const { hasAnyOfRoles } = require('../utils/permsManager');
const serverData = require('../server-config.json')

module.exports = {
    name: 'mbdone',
    description: 'Sample description',
    aliases: [''],
    async execute(client, message, args, Discord) {
        if (!hasAnyOfRoles(message, [serverData.ROLES.HEAD_STAFF, serverData.ROLES.SENIOR_STAFF, serverData.ROLES.JUNIOR_STAFF, serverData.ROLES.MB_HOST, ])) return message.channel.send('You are not allowed to use this command!')
        client.emit('mbremove', message, Discord)
    }
}