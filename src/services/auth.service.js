'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require("./keyToken.service")
const { createTokenPair, verifyToken } = require("../utils/authUtils")
const { getInfoData } = require("../utils")
const { BadRequestError, AuthFailureError } = require("../core/error.response")
const ShopService = require("./shop.service")
const CartRepo = require("../repositories/cart.repo")


class AuthService{

    static handlerRefreshToken = async ({user, refreshToken, keyStore})=>{
        const {userId, email} = user
        if(keyStore.refreshTokensUsed.includes(refreshToken)){
            await KeyTokenService.removeKeyById(keyStore._id)
            throw new AuthFailureError("Login again!")
        }
        const holderShop = await ShopService.findShopByEmail({email})
        if(!holderShop) {
            throw new BadRequestError("Unregistered user")
        }
        const tokens = await createTokenPair({userId: holderShop._id, email}, keyStore.publicKey, keyStore.privateKey)
        // await keyStore.update({
        //     $set: {
        //         refreshToken: tokens.refreshToken
        //     },
        //     $addToSet:{
        //         refreshTokensUsed: refreshToken
        //     }
        // })
        // console.log(keyStore._id, "WTF")
        // console.log("CC2C")

        const keyToken = await KeyTokenService.updateRefreshToken({refreshToken ,id: keyStore._id, tokens})
        // console.log(keyToken, "???")
        return tokens
    }

    static logout = async(keyStore)=>{
        await KeyTokenService.removeKeyById(keyStore._id)
        return "Đã Logout thành công"
    }

    static login = async({email, password, refreshToken = null})=>{
        const holderShop = await ShopService.findShopByEmail({email})
        if(!holderShop) {
            throw new BadRequestError("Unregistered user")
        }
        const isSamePass = await bcrypt.compare(password, holderShop.password)
        if(!isSamePass){
            throw new AuthFailureError("Mật khẩu không chính xác")
        }
        const publicKey = crypto.randomBytes(64).toString('Hex')
        const privateKey = crypto.randomBytes(64).toString('Hex')
        const tokens = await createTokenPair({userId: holderShop._id, email}, publicKey, privateKey)

        await KeyTokenService.createKeyToken({userId: holderShop._id, publicKey, privateKey, refreshToken: tokens.refreshToken})
        
        return {
            shop: getInfoData({fields: ['_id', 'name', 'email'], object: holderShop}),
            tokens: tokens
        }
    }
    
    static signUp = async({name, email, password}) => {
            const holderShop = await ShopService.findShopByEmail({email})
            if(holderShop) {
                throw new BadRequestError("Email đã được sử dụng", 404)
            }
            const passwordHash = await bcrypt.hash(password, 10)
            const newShop = await shopModel.create({name, email, password: passwordHash, roles: ['ADMIN']})
            if(newShop){
                const CartUser = await CartRepo.createCart({userId: newShop._id})
                if(!CartUser) throw new BadRequestError("error create cart for user")
                const publicKey = crypto.randomBytes(64).toString('Hex')
                const privateKey = crypto.randomBytes(64).toString('Hex')
                const tokens = await createTokenPair({userId: newShop._id, email}, publicKey, privateKey)
                const keyHolder = await KeyTokenService.createKeyToken({userId: newShop._id, publicKey, privateKey, 
                refreshToken: tokens.refreshToken})
                if(!keyHolder){
                    return {
                        code: "XXX",
                        message: "key token error"
                    }
                }
                return {
                        shop: getInfoData({fields: ['_id', 'name', 'email'], object: newShop}),
                        tokens: tokens
                }
            }
    }
}

module.exports = AuthService