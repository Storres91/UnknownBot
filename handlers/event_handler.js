const fs = require('fs');

module.exports = (client, Discord, message) => {
    const load_dir = (dir) => {
        const event_files = fs.readdirSync(`./events/${dir}/`).filter(file => file.endsWith('.js'));
        for (const file of event_files) {
            const event = require(`../events/${dir}/${file}`);
            const event_name = file.split('.')[0];        
            if (event.once) {
                client.once(event_name, (...args) => event.execute(...args, client, Discord, message));
            } else {
                client.on(event_name, (...args) => event.execute(...args, client, Discord, message));
            }
        }
    }

    ['client', 'guild'].forEach(e => load_dir(e));


}