'use strict'

const { BadRequestError } = require("../core/error.response");
const CartRepo = require("../repositories/cart.repo")


class CartService {
    static async addToCart({userId, product}){
        const cart = await  CartRepo.findCartByUserId({userId})
        const isInCart = cart.cart_products.find(item => item.product_id === product.product_id)

        let upd_cart;
        // neu chua co san pham trong cart thi them san pham
        if(!isInCart){
            upd_cart = await CartRepo.addToCart({
                userId,
                product
            })
        }
        else{// neu co san pham trong cart thi them quatity san pham
            upd_cart = await CartRepo.updateQuantityProductInCart({
                userId,
                product
            })
        }
        if(!upd_cart) throw new BadRequestError("Update cart failed")
        return upd_cart
    }


}

module.exports = CartService