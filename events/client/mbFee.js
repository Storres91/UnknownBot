const { ROLES } = require('../../server-config.json')

module.exports = {
    name: 'mbFee',
    async execute(message, Discord) {
        if (!message.content.toLowerCase().startsWith('rpg give ')) return
        if (!(message.content.includes('313351494361677845') || message.content.includes('707788113677647944'))) return

        const role = await message.guild.roles.fetch(ROLES.MB_FEE_ROLE);

        const filter = (m) => m.author.id === '555955826880413696';
        const collector = new Discord.MessageCollector(message.channel, {
            filter,
            time: 1000 * 3
        });
        
        collector.on('collect', (m)=>{
            if(m.content.includes('500,000,000')){
                message.member.roles.add(role.id)
                message.channel.send(`Successfully given **${role.name}** role.`)
                message.react('✅')
                return
        	}
            message.channel.send("Transaction failed")
            message.react('❌')
            
        })

    }
}