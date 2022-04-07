const { ROLES } = require('../../server-config.json')
const { hasAnyOfRoles, hasAllOfRoles } = require('../../utils/permsManager.js')

const AllRoles = [ROLES.TT0, ROLES.TT1, ROLES.GA_TT1, ROLES.TT2, ROLES.TT3_19, ROLES.GA_TT2_19, ROLES.TT20P, ROLES.GA_TT20P, ROLES.SUPER_LIST_MB, ROLES.ULTRA_LIST_MB, ROLES.LEGENDARY_LIST_MB]

module.exports = {
    name: 'ttVerify',
    async execute(message, Discord) {
        if (message.content.toLowerCase().startsWith('rpg bg')) return
        if (!(message.content.toLowerCase().startsWith('rpg p') || message.content.toLowerCase().startsWith('rpg progress'))) return message.reply('Invalid input, please show me your profile, `rpg p`')

        const ttEmbed = new Discord.MessageEmbed()
            .setTitle('🌀 TT Verification 🌀')
            .setColor('#40f020')
            .setFooter({text: 'Astro Legends', iconURL: message.guild.iconURL()})
            .setTimestamp();
        

        const filter = m => m.author.id == '555955826880413696';
        const collector = new Discord.MessageCollector(message.channel, { filter, time: 30000 });
        let ttCount
        collector.on('collect', m => {
            if (m.attachments.size != 0) return message.reply('Please remove your profile background and try again.')

            ttCount = m.embeds[0].fields[0].value.split(' ').slice(-1).join();
            ttCount = parseInt(ttCount)


            let actionSummary = `You currently have **${ttCount} Time Travels**. \n\n`;

            //Determine role to be given
            let rolesToGive;

            if (ttCount == 0) {
                rolesToGive = [ROLES.TT0]

            } else if (ttCount == 1) {
                rolesToGive = [ROLES.TT1, ROLES.GA_TT1, ROLES.SUPER_LIST_MB]

            } else if (ttCount == 2) {
                rolesToGive = [ROLES.TT2, ROLES.GA_TT2_19, ROLES.SUPER_LIST_MB]

            } else if (ttCount > 2 && ttCount < 20) {
                rolesToGive = [ROLES.TT3_19, ROLES.GA_TT2_19, ROLES.LEGENDARY_LIST_MB]

            } else {
                rolesToGive = [ROLES.TT20P, ROLES.GA_TT20P, ROLES.LEGENDARY_LIST_MB]

            }

            //Give roles
            if(!hasAllOfRoles(message, rolesToGive)){
                actionSummary = actionSummary + '**Given roles:**\n';

                for (let role of rolesToGive){
                    if(hasAnyOfRoles(message, [role])) continue

                    message.member.roles.add(role)
                    actionSummary = actionSummary + `🟢 <@&${role}>\n`;
                }
            }

            //Determine roles to remove
            const rolesToRemove = [];
            for(let role of AllRoles) {
                if (rolesToGive.indexOf(role) == -1) rolesToRemove.push(role)
            }

            //Remove roles
            if(hasAnyOfRoles(message, rolesToRemove)){
                actionSummary = actionSummary + '\n**Removed roles:**\n';

                for (let role of rolesToRemove){
                    if(!hasAnyOfRoles(message, [role])) continue

                    message.member.roles.remove(role)
                    actionSummary = actionSummary + `🔴 <@&${role}>\n`;
                }
            }

            if (!hasAnyOfRoles(message, rolesToRemove) && hasAllOfRoles(message, rolesToGive)) actionSummary = actionSummary + '🟡 You already have all the correct roles, no changes were made.'



            ttEmbed.setDescription(actionSummary);
            message.reply({ embeds: [ttEmbed] })

            collector.stop();
        });
    }
}