'use strict'

const shopModel = require("../models/shop.model")

class ShopService {
    static findShopByEmail = async ({email, select={
        email: 1, password: 1, name: 1, status:1, roles: 1
    }})=>{
        const shop = await shopModel.findOne({email}).select(select).lean()
        return shop
    }
}

module.exports = ShopService