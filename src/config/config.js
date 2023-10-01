const packageJSON = require('./../../package.json')

const config = {
    development: {
        version: packageJSON.version,
        secret: '2a7b5ca502e1825c414816c712301269'
    },
    production: {
        version: packageJSON.version,
        secret: process.env.SECRET
    }
}

exports.get = (env) => config[env] ?? config.development;
