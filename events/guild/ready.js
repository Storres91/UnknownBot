module.exports = {
    name: 'ready',
    once: true,
    async execute(client, message, args, Discord) {
        console.log(`Ready! Logged in as ${client.user.tag}`)
    }
}