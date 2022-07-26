const Discord = require('discord.js');
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_PRESENCES", "GUILD_MEMBERS",] })
require('dotenv').config();



client.commands = new Discord.Collection();
client.events = new Discord.Collection();

['command_handler', 'event_handler', 'dbLogin'].forEach(handler => {
    require(`./handlers/${handler}`)(client, Discord);
})

client.login(process.env.DISCORD_TOKEN);
client.dbLogin();