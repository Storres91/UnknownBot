module.exports = {
    name: 'ping',
    description: 'Pongs bot',
    aliases: ['pong'],
    async execute(client, message, args, Discord) {
        message.channel.send('Pong')
    }
}