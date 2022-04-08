const fs = require('fs');

module.exports = {
    name: 'jsonManipulation',
    jsonReader(filepath, cb) {
        fs.readFile(filepath, 'utf-8', (err, fileData) => {
            if (err) return cb && cb(err);

            try {
                const object = JSON.parse(fileData);
                return cb && cb(null, object);
            } catch (error) {
                return cb && cb(err);
            }
        });
    },
    
}