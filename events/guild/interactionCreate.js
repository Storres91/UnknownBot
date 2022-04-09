const { ROLES } = require('../../server-config.json')
const { hasAnyOfRoles } = require('../../utils/permsManager.js')
const { jsonReader } = require('../../utils/jsonManipulation.js');
const fs = require('fs');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client, Discord) {

        if (interaction.isButton()) {

            //Clear mb list
            if (interaction.customId == 'clearMbList') {
                if(!hasAnyOfRoles(interaction, [ROLES.JUNIOR_STAFF, ROLES.SENIOR_STAFF, ROLES.HEAD_STAFF, ])) {
                    interaction.reply({
                        content: `Only staff members are allowed to clear the list.`,
                        ephemeral: true
                    });

                } else {
                    jsonReader('./server-data.json', (err, data) => {
                        if (err) console.log(err);
                        else {
                            data.MINIBOSS_LIST.USERS_ON_LIST = [];
            
                            fs.writeFile('./server-data.json', JSON.stringify(data, null, 4), err => {
                                if (err) console.log(err);
                            });
            
                        }
                    });
            
                    setTimeout(() => {
                        client.emit('updateMb', client, interaction.guild, Discord);
                    }, 600);

                    interaction.reply({
                        content: '🟢 List cleared!',
                        ephemeral: true
                    });
                }
            }

            //Lock list
            if (interaction.customId == 'lockMbList') {
                if(!hasAnyOfRoles(interaction, [ROLES.JUNIOR_STAFF, ROLES.SENIOR_STAFF, ROLES.HEAD_STAFF, ])) {
                    interaction.reply({
                        content: `Only staff members are allowed to lock the list.`,
                        ephemeral: true
                    });

                } else {
                    jsonReader('./server-data.json', (err, data) => {
                        if (err) console.log(err);
                        else {
                            data.MINIBOSS_LIST.LOCKED = true;
            
                            fs.writeFile('./server-data.json', JSON.stringify(data, null, 4), err => {
                                if (err) console.log(err);
                            });
            
                        }
                    });

                    setTimeout(() => {
                        client.emit('updateMb', client, interaction.guild, Discord);
                    }, 600);

                    interaction.reply({
                        content: '🔴 List locked!',
                        ephemeral: true
                    });
                }
            }

            //Unlock list
            if (interaction.customId == 'unlockMbList') {
                if(!hasAnyOfRoles(interaction, [ROLES.JUNIOR_STAFF, ROLES.SENIOR_STAFF, ROLES.HEAD_STAFF, ])) {
                    interaction.reply({
                        content: `Only staff members are allowed to unlock the list.`,
                        ephemeral: true
                    });

                } else {
                    jsonReader('./server-data.json', (err, data) => {
                        if (err) console.log(err);
                        else {
                            data.MINIBOSS_LIST.LOCKED = false;
            
                            fs.writeFile('./server-data.json', JSON.stringify(data, null, 4), err => {
                                if (err) console.log(err);
                            });
            
                        }
                    });

                    setTimeout(() => {
                        client.emit('updateMb', client, interaction.guild, Discord);
                    }, 600);

                    interaction.reply({
                        content: '🟢 List unlocked!',
                        ephemeral: true
                    });
                }
            }
        }
    }
}