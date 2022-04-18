const { ROLES } = require('../../server-config.json')

module.exports = {
    name: 'mbFee',
    async execute(message, Discord) {
        if (!message.content.toLowerCase().startsWith('rpg give ')) return
        if (!message.content.includes('313351494361677845') || !message.content.includes('707788113677647944')) return

        const filter = (m) => m.author.id === message.author.id;
        const collector = new Discord.MessageCollector(message.channel, {
            filter,
            time: 1000 * 3
        });

        collector.on('collect', (m)=>{
            if(m.content.includes('300,000,000 coins')) return message.member.roles.add(ROLES.GOD_MB)
        })

    }
}