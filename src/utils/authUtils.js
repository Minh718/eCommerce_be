'use strict'

const JWT = require('jsonwebtoken')
const { asyncHandlerError } = require('.')
const { AuthFailureError, NotFoundError } = require('../core/error.response')
const { findKeyTokenByUserId } = require('../services/keyToken.service')

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization'
}

const createTokenPair = async (payload,publicKey, privateKey)=> {
                // console.log('tokens', tokens)

    try {
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: '2 days'
        })
        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: '7 days'
        })

        return {accessToken, refreshToken}
    } catch (error) {
        
    }
}

const verifyToken = async (token, key)=>{
    return await JWT.verify(token, key)
}
module.exports = {
    createTokenPair,
    verifyToken
}