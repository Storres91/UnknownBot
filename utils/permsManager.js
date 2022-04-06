const {ROLES} = require('../server-config.json')

module.exports = {
    name: 'permsManager',
    isAllowed({message, roles=[], users=[]}={}){
        if (roles.length == 0 && users.length == 0) return true

        for (const roleToCheck of roles){
            if (message.member.roles.cache.some(role => role.id === ROLES[roleToCheck])) return true
        }
        for (const userToCheck of users){
            if(message.author.id == userToCheck) return true
        }
        return false

    },
    hasRoles(message, roles = []) {
        if (roles.length == 0) return true
        for (const roleToCheck of roles) {
            if (message.member.roles.cache.some(role => role.id === ROLES[roleToCheck])) return true
        }    
        return false

    },
    isUser(message, users = []){
        if (users.length == 0) return true
        for (const userToCheck of users){
            if(message.author.id == userToCheck) return true
        }
        return false
        
    }
}