const { CHANNELS, ROLES } = require('../../server-config.json')
const { hasAnyOfRoles, hasAllOfRoles } = require('../../utils/permsManager.js')

const AllRoles = [ROLES.TT0_1, ROLES.GA_TT1, ROLES.TT2_19, ROLES.GA_TT2_19, ROLES.TT20P, ROLES.GA_TT20P, ROLES.MB1K, ROLES.MB4K, ROLES.MB8K]

module.exports = {
    name: 'ttVerify',
    async execute(message, Discord) {
        if (message.content.toLowerCase().startsWith('rpg bg')) return
        if (!(message.content.toLowerCase().startsWith('rpg p') || message.content.toLowerCase().startsWith('rpg progress'))) return message.reply('Invalid input, please show me your profile, `rpg p` or `rpg progress`')

        const ttEmbed = new Discord.MessageEmbed()
            .setTitle('🌀 TT Verification 🌀')
            .setColor('#40f020')
            .setFooter({text: 'Astro Legends', iconURL: message.guild.iconURL()})
            .setTimestamp();
        

        const filter = m => m.author.id === '555955826880413696';
        const collector = new Discord.MessageCollector(message.channel, { filter, time: 30000 });
        let ttCount
        collector.on('collect', m => {
            if (m.attachments.size != 0) {
                message.reply('Please remove your profile background and try again.')
                collector.stop();
                return;
            }

            ttCount = m.embeds[0].fields[0].value.split(' ').slice(-1).join();
            ttCount = parseInt(ttCount)


            let actionSummary = `You currently have **${ttCount} Time Travels**. \n\n`;

            //Determine role to be given
            let rolesToGive;

            if (ttCount == 0) {
                rolesToGive = [ROLES.TT0_1]

            } else if (ttCount == 1) {
                rolesToGive = [ROLES.TT0_1, ROLES.GA_TT1, ROLES.MB1K]

            } else if (ttCount == 2) {
                rolesToGive = [ROLES.TT2_19, ROLES.GA_TT2_19, ROLES.MB1K, ROLES.MB4K]

            } else if (ttCount > 2 && ttCount < 20) {
                rolesToGive = [ROLES.TT2_19, ROLES.GA_TT2_19, ROLES.MB1K, ROLES.MB4K, ROLES.MB8K]

            } else {
                rolesToGive = [ROLES.TT20P, ROLES.GA_TT20P, ROLES.MB1K, ROLES.MB4K, ROLES.MB8K]

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

            if (!hasAnyOfRoles(message, rolesToRemove) && hasAllOfRoles(message, rolesToGive)) actionSummary = actionSummary + '🟡 You already have all the correct roles, no changes were made.\n'

            actionSummary = actionSummary + `\nTo remove roles, go to <#${CHANNELS.REACTION_ROLES}>`

            ttEmbed.setDescription(actionSummary);
            message.reply({ embeds: [ttEmbed] })

            collector.stop();
        });
    }
}