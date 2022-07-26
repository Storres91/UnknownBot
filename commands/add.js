const { ROLES } = require('../server-config.json')
const { hasAnyOfRoles } = require('../utils/permsManager');
const serverData = require('../server-config.json');
const { transformToId } = require('../utils/targets.js');
const debtDataModel = require('../models/debtSchema.js');

module.exports = {
    name: 'add',
    description: 'Adds debt to an user',
    aliases: [''],
    async execute(client, message, args, Discord) {
        if (!hasAnyOfRoles(message, [serverData.ROLES.HEAD_STAFF, serverData.ROLES.SENIOR_STAFF, serverData.ROLES.JUNIOR_STAFF, ])) return message.channel.send('You are not allowed to use this command!');

        switch (args[0]) {
            case 'debt':
                if(!args[2]) return message.channel.send('Use this command properly! `-add debt <amount> <@user/id>`\n**Note:** Valid amounts are 500m or #b.')

                let debt;
                if(args[1].toLowerCase() == '500m') debt = 0.5;
                else {
                    if(!args[1].toLowerCase().match(/b/)) return message.channel.send('Use this command properly! `-add debt <amount> <@user/id>`\n**Note:** Valid amounts are 500m or #b.')
                    debt = args[1].replace(/\D+/g,'')+"" || 0
                    if(debt==0) return message.channel.send(`\`${args[1]}\` invalid debt amount.`)
                }

                let membersList=[];
                for (let user of args.slice(2)) {
                    let userId = transformToId(user);
                    user = await message.guild.members.fetch(userId).catch(()=>null);
                    if (!user) return message.channel.send(`\`${user}\` is not a valid user.`);
        
                    membersList.push(user);
                }

                for(let member of membersList){
                    let debtData;
                    try {
                        debtData = await debtDataModel.findOne({ userID: member.id });
                    } catch (err) {
                        console.log(`Error getting debtData ${err}`)
                    }

                    if(!debtData){
                        debtData = await debtDataModel.create({
                            userID: member.id,
                            debtAmount: parseFloat(debt) || 0
                        });
                    }else{
                        debtData.debtAmount+=(parseFloat(debt) || 0);
                    }
                    
                    debtData.save();
                    message.channel.send(`Added **${debt}b** to **${member.user.tag}'s** debt.\n Total: **${debtData.debtAmount}b**.`);
                    if(debtData.debtAmount>=5) {
                        message.channel.send(`**${member.user.tag}** has more than 5b in debt, restricted access to mb channels.`);
                        member.roles.add(ROLES.MB_BANNED)
                    }

                }

                break;
        
            default:
                return;
        }
    }
}