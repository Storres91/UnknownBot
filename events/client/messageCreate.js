const botConfig = require('../../bot-config.json')
module.exports = {
    async execute(message, client, Discord) {
        const prefix = botConfig.prefix;

        if (!message.content.toLowerCase().startsWith(prefix) || message.author.bot) return;
        if (message.channel.type == 'dm') return;

        const args = message.content.slice(prefix.length).split(/ +/);
        const cmd = args.shift().toLowerCase();

        const command = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd));

        if (!command) return;
        try {
            command.execute(client, message, args, Discord);
        } catch (err) {
            console.log(err);
        }


    }
}