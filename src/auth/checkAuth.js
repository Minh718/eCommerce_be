'use strict'

const { AuthFailureError, NotFoundError } = require("../core/error.response")
const { apiKeyFindById } = require("../services/apikey.service")
const { findKeyTokenByUserId } = require("../services/keyToken.service")
const { asyncHandlerError } = require("../utils")
const JWT = require('jsonwebtoken')
const { verifyToken } = require("../utils/authUtils")

const HEADER = {
    CLIENT_ID: 'x-client-id',
    API_KEY:  'x-api-key',
    AUTHORIZATION: 'authorization',
    REFRESHTOKEN: 'x-rtoken-id'
}

const apiKey = async (req, res, next)=>{
    try {
        const key = req.headers[HEADER.API_KEY]?.toString()
        if(!key){
            return res.status(403).json({message: "Forbidden Error 1"})
        }
        const objKey = await apiKeyFindById(key)
        if(!objKey){
            return res.status(403).json({message: "Forbidden Error 2"})
        }
        req.objKey = objKey
        return next()
    } catch (error) {
        
    }
}

const validatePermission = (permission) => {
    return (req, res, next)=>{
        console.log(req.objKey)
        const permissions = req.objKey.permissions
        if(!permissions){
            return res.status(403).json({message: "Forbidden Error 2"})
        }
        console.log("permission: ", permissions)
        const validPermission = permissions.includes(permission)
        if(!validPermission) return res.status(403).json({message: "Permission denied"})
        return next()
    }
}

const authentication = asyncHandlerError(async (req, res, next )=>{
    const userId = req.headers[HEADER.CLIENT_ID]
    if(!userId) throw new AuthFailureError("lỗi request client id")
    const keyStore = await findKeyTokenByUserId(userId)
    if(!keyStore) throw new NotFoundError("Not find key")

    // check khi yêu cầu refreshToken thì vào đây
    const refreshToken = req.headers[HEADER.REFRESHTOKEN];
    if(refreshToken){
        try {
            const decodeUser = await verifyToken(refreshToken, keyStore.privateKey)
            if(userId != decodeUser.userId) throw new AuthFailureError("wrong token")
            req.keyStore = keyStore
            req.user = decodeUser
            req.refreshToken = refreshToken
            return next()
        } catch (error) {
            throw error
        }
    }

    //còn không thì vào đây
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if(!accessToken) throw new AuthFailureError("invalid request")
    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if(userId != decodeUser.userId) throw new AuthFailureError("invalid request")
        req.user = decodeUser
        req.keyStore = keyStore
    return next() 
    } catch (error) {
        throw error
    }


})


module.exports = {
    apiKey,
    validatePermission,
    authentication
}