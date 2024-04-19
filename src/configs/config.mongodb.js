
'use strict'

// 0

const dev = {
    app: {
        port: process.env.DEV_APP_PORT || 3000
    },
    db: {
        host: process.env.DEV_DB_HOST || 'localhost',
        port: process.env.DEV_DB_PORT || 27017,
        name: process.env.DEV_DB_NAME || 'shopDEV'
    }
}

const proc = {
    app: {
        port: process.env || 3000
    },
    db: {
        host: process.env.PROC_DB_HOST || 'localhost',
        port: process.env.PROC_DB_PORT || 27017,
        name: process.env.PROC_DB_NAME || 'shopDEV'
    }
}
const config = {dev, proc}
const env = process.env.NODE_ENV || 'dev'
console.log(process.env.NODE_ENV)
module.exports = config[env]