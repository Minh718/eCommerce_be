'use strict'
const { token } = require('morgan')
const keyTokenModel = require('../models/key.token')
const { findOne } = require('../models/shop.model')
const ObjectId = require("mongoose").Types.ObjectId
class KeyTokenService {

    static createKeyToken = async ({userId, publicKey, privateKey, refreshToken}) =>{
        try {
            // const keyHolder = await keyTokenModel.create({
            //     user: userId,
            //     publicKey: publicKey,
            //     privateKey: privateKey
            // })
            const filter = {user: userId}, update = {publicKey, privateKey, refreshTokensUsed: [], refreshToken},
            options = {upsert: true, new: true}
            const keyToken = await keyTokenModel.findOneAndUpdate(filter, update, options)
            return keyToken ? keyToken : ""
        } catch (error) {
            
        }
    }
    static findKeyTokenByUserId = async (userId)=>{
        var objectId= new ObjectId(userId);
        return await keyTokenModel.findOne({user: objectId})
    }

    static removeKeyById = async(id) => {
        return await keyTokenModel.deleteOne({_id: id})
    }
    // static findByRefreshTokenUsed = async (refreshToken) =>{
    //     return await keyTokenModel.findOne({refreshTokensUsed: {$in: [refreshToken]}})
    // }
    static findByRefreshToken = async (refreshToken) =>{
        return await keyTokenModel.findOne({refreshToken})
    }
    static updateRefreshToken = async ({refreshToken ,id, tokens})=>{
        return await keyTokenModel.findOneAndUpdate({_id: id} , {
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet:{
                refreshTokensUsed: refreshToken
            }
        },{upsert: true, new: true})
    }
}

module.exports = KeyTokenService