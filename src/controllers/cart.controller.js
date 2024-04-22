'use strict'

const { OK } = require("../core/success.reponse")
const CartService = require("../services/cart.service")


class CartController {
    static async addToCart(req, res, next){
        return new OK({message: "Add product to cart sucessfully",
        metadata: await CartService.addToCart({...req.body, userId: req.user.userId})
    }).send(res)
    }

}

module.exports = CartController