'use strict'

const mongoose = require('mongoose')
const {countConnect} = require('../helpers/check.connectdb')

const {db : {host, name, port}} = require('../configs/config.mongodb')
const connectString = `mongodb://${host}:${port}/${name}`
class Database {
    constructor(){
        this.connect()
    }
    connect(type = 'mongodb'){
        if(1===1){
            mongoose.set('debug', true)
            mongoose.set('debug', {color: true})
        }
        mongoose.connect(connectString).then(_ => {
            countConnect()
            console.log(`connect success with ${name}`)}).catch(err => console.log('err connnect db'))
    }
    static getInstance() {
        if(!Database.instance){
            Database.instance = new Database()
        }
        return Database.instance
    }
}

const instanceMongodb = new Database();
module.exports =  instanceMongodb
