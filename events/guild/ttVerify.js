const { ROLES } = require('../../server-config.json')

module.exports = {
    name: 'ttVerify',
    async execute(message, Discord) {
        if (message.content.toLowerCase().startsWith('rpg bg')) return
        if (!message.content.toLowerCase().startsWith('rpg p') || !message.content.toLowerCase().startsWith('rpg stats')) return message.reply('Invalid input, please show me your profile, `rpg p`')
        
        const ttEmbed = new Discord.MessageEmbed()
            .setTitle('✅ TT Verification ✅')
            .setTimestamp();

        const filter = m=> m.author.id == '555955826880413696';
        const collector = new Discord.MessageCollector(message.channel, {filter, time: 30000});

        let ttCount;
        collector.on('collect', m => {
            if(m.attachments.size != 0) return message.reply('Please remove your profile background and try again.')

            ttCount = m.embeds[0].fields[0].value.split(' ').slice(-1).join();
            ttCount = parseInt(ttCount)
            collector.stop();
        })

        let actionSummary = `You currently have **${ttCount} Time Travels** \n\n`;

        //Determine role to be given
        let givenRoles;
        actionSummary = actionSummary + '**Given roles:**\n';

        if (ttCount == 0) {
            message.member.roles.add(ROLES.TT0)
            
            givenRoles = [ROLES.TT0]

        } else if (ttCount == 1) {
            message.member.roles.add(ROLES.TT1)
            message.member.roles.add(ROLES.GA_TT1)
            message.member.roles.add(ROLES.SUPER_LIST_MB)

            givenRoles = [ROLES.TT1, ROLES.GA_TT1, ROLES.SUPER_LIST_MB]

        } else if (ttCount == 2) {
            message.member.roles.add(ROLES.TT2)
            message.member.roles.add(ROLES.GA_TT2_19)
            message.member.roles.add(ROLES.SUPER_LIST_MB)

            givenRoles = [ROLES.TT2, ROLES.GA_TT2_19, ROLES.SUPER_LIST_MB]
        } else if (ttCount >2 && ttCount <20) {
            message.member.roles.add(ROLES.TT3_19)
            message.member.roles.add(ROLES.GA_TT2_19)
            message.member.roles.add(ROLES.LEGENDARY_LIST_MB)

            givenRoles = [ROLES.TT3_19, ROLES.GA_TT2_19, ROLES.LEGENDARY_LIST_MB]
        } else {
            message.member.roles.add(ROLES.TT20P)
            message.member.roles.add(ROLES.GA_TT20P)
            message.member.roles.add(ROLES.LEGENDARY_LIST_MB)

            givenRoles = [ROLES.TT20P, ROLES.GA_TT20P, ROLES.LEGENDARY_LIST_MB]
        }

        //Add roles to the message
        for (let role of givenRoles) {
            actionSummary = actionSummary + `➕ <@&${role}>\n`
        }

        ttEmbed.setDescription(actionSummary);
        message.reply(ttEmbed)
    }
}