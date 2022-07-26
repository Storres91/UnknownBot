const { hasAnyOfRoles } = require('../utils/permsManager');
const serverData = require('../server-config.json');
const { transformToId } = require('../utils/targets.js');
const debtDataModel = require('../models/debtSchema.js');

module.exports = {
    name: 'remove',
    description: 'Removes debt from an user',
    aliases: [''],
    async execute(client, message, args, Discord) {
        if(args[0] != 'debt') return;

        let debtData;
        try {
            debtData = await debtDataModel.findOne({userID: message.author.id})
        } catch (error) {
            console.log('Error getting debtData.\n'+error)
        }
        if(!debtData) return message.channel.send('You don\'t have any debt yet.')
        
        const debtRemovalRow = new Discord.MessageActionRow().addComponents(
            new Discord.MessageButton()
                .setCustomId("debtRemoveAll")
                .setLabel("Remove All Debt")
                .setStyle("SUCCESS"),

            new Discord.MessageButton()
                .setCustomId("debtRemoveHalf")
                .setLabel("Remove Half Debt")
                .setStyle("PRIMARY")
        );
        
        let debtMsg, debtToRemove, command;
        message.channel.send({components:[debtRemovalRow]}).then(sent=> debtMsg=sent)

        const debtOptionCollector = new Discord.InteractionCollector(client, {
            channel: message.channel,
            message: debtMsg,
        });
        debtOptionCollector.on('collect', (i) => {
            i.deferUpdate();
            if(i.member.id != message.author.id) return i.reply({content:'These are not yours!', ephemeral:true})

            if(i.customId == 'debtRemoveAll') debtToRemove = debtData.debtAmount;
            if(i.customId == 'debtRemoveHalf') debtToRemove = debtData.debtAmount/2;
            if(hasAnyOfRoles(message,[serverData.ROLES.TT20P])) command = `\`rpg give <@313351494361677845> ${debtToRemove}b\``;
            else command = `\`rpg give <@707788113677647944> ${debtToRemove}b\``;
            
            message.channel.send(command)
            message.channel.send('Copy and paste the command as it is or the bot won\'t be able to detect the payment.')
            i.message.delete();
            debtOptionCollector.stop()
        });

        debtOptionCollector.on('end', ()=>{
            const filter = (m) => m.author.id === '555955826880413696' || m.author.id === message.author.id;
            const collector = new Discord.MessageCollector(message.channel, {
                filter,
                time: 1000 * 60
            });

            let commandDone = false;
            collector.on('collect', (m)=>{
                if(m.author.id == message.author.id && m.content == command.replaceAll('\`','')) commandDone=true
                if(commandDone && m.author.id === '555955826880413696'){
                    if(m.content.includes('gave')){
                        message.react('✅')
                        debtData.debtAmount-=debtToRemove;
                        debtData.save();
                        message.channel.send(`Removed debt, new total: ${debtData.debtAmount}b`)
                        collector.stop();

                    }else commandDone = false
                }
            });

            collector.on('end',()=>{
                if(!commandDone) return message.channel.send('Transaction failed run out of time, try again.')
            })
        })
    }
}

