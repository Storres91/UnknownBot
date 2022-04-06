module.exports = {
    name: 'targets',
    transformToId (args) {
        return args.replace(/[^0-9a-zA-Z]/g,'');
    },
}