'use strict'

const { cart_model } = require("../models/cart.model")


class CartRepo {
    static async removeProductInCart({userId, product_id}){
        const filter = {cart_user_id: userId}
        , update= {
            $pull: {cart_products: {product_id: product_id}}
        }
        return cart_model.updateOne(filter,update)
    }
    static async addToCart({userId, product}){
        const filter = {cart_user_id: userId}
        , update= {
            $addToSet: {cart_products: product}
        }, options = {
            new: true, upsert: true
        }
        return cart_model.findOneAndUpdate(filter,update,options)
    }
    static async findCartByUserId({userId}){
        return cart_model.findOne({cart_user_id: userId})
    }
    static async createCart({userId}){
        return cart_model.create({cart_user_id: userId})
    }
    static async updateQuantityProductInCart({userId, product}){
        const {product_id, quantity} = product
        const filter = {cart_user_id: userId,
            'cart_products.product_id': product_id
            }
            , update= {
                $inc: {
                    'cart_products.$.quatity': quantity
                }
            }, options = {
                new: true, upsert: true
            };
        return cart_model.findOneAndUpdate(filter,update,options)  

    }

}

module.exports = CartRepo