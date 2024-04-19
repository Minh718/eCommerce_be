'use strict'

const mongoose = require('mongoose')
const os = require('os')
const process = require('process')
const _TIME = 5000

const countConnect = () => {
    const numcondb = mongoose.connections.length
    console.log( 'num connect: ',numcondb)
}

// check over load

const checkOverLoad = () =>{
    setInterval(()=>{
        const numCondb = mongoose.connections.length
        const numCores = os.cpus().length
        const usedMemory = process.memoryUsage().rss;
        
    }, _TIME)
}

module.exports = {
    countConnect
}