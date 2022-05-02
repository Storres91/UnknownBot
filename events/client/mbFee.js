const { ROLES } = require('../../server-config.json')

module.exports = {
    name: 'mbFee',
    async execute(message, Discord) {
        if (!message.content.toLowerCase().startsWith('rpg give ')) return
        if (!(message.content.includes('313351494361677845') || message.content.includes('707788113677647944'))) return

        let role = await message.guild.roles.fetch(ROLES.MB_FEE_ROLE);

        const filter = (m) => m.author.id === '555955826880413696';
        const collector = new Discord.MessageCollector(message.channel, {
            filter,
            time: 1000 * 3
        });
        
        collector.on('collect', (m)=>{
            if(m.content.includes('500,000,000 coins')){
                message.member.roles.add(ROLES.MB_FEE_ROLE)
                message.channel.send(`Successfully given **${role.name}** role.`)
                return
            }
        })

    }
}