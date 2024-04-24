'use strict'

const { resolve } = require('path')
const redis = require('redis')
const {promisify} = require('util')
const InventoryRepo = require('../repositories/inventory.repo')
const redisClient = redis.createClient()

const setnxAsync = promisify(redisClient.setnx).bind(redisClient)


const acquireLock = async ({product_id, quantity, cart_id})=>{
    const key = `lock_${product_id}`
    const retimes = 10
    const expiretime = 30000
    for (let i = 0; i < retimes; i++) {

    const result = await setnxAsync(key, expiretime);
        if(result  === 1){
            const isEnoughProduct = await InventoryRepo.checkEnoughProduct({product_id, quantity, cart_id})
            await releaseLock(key)
            return isEnoughProduct;
        }
        else{
            await new Promise((resolve)=> setTimeout(resolve, 50))
        }   
    }
}

const releaseLock = async (keyLock)=>{
    const delAsyncKey = promisify(redisClient.del).bind(redisClient)
    return delAsyncKey(keyLock)
}

module.exports = {
    acquireLock
}