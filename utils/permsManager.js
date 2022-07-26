const {ROLES} = require('../server-config.json')

module.exports = {
    name: 'permsManager',
    isAllowed({message, roles=[], users=[]}={}){
        if (roles.length == 0 && users.length == 0) return true

        for (const roleToCheck of roles){
            if (message.member.roles.cache.some(role => role.id === roleToCheck)) return true
        }
        for (const userToCheck of users){
            if(message.author.id == userToCheck) return true
        }
        return false

    },
    hasAnyOfRoles(message, roles = []) {
        if (roles.length == 0) return true
        for (const roleToCheck of roles) {
            if (message.member.roles.cache.some(role => role.id === roleToCheck)) return true
        }    
        return false

    },
    hasAllOfRoles(message, roles = []){
        if (roles.length == 0) return true
        for (const roleToCheck of roles) {
            if (!message.member.roles.cache.some(role => role.id === roleToCheck)) return false
        }    
        return true
    },
    isUser(message, users = []){
        if (users.length == 0) return true
        for (const userToCheck of users){
            if(message.author.id == userToCheck) return true
        }
        return false
        
    }
}