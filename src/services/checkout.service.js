'use strict'

const { BadRequestError } = require("../core/error.response")
const { order_model } = require("../models/order.model")
const { product } = require("../models/product.model")
const CartRepo = require("../repositories/cart.repo")
const InventoryRepo = require("../repositories/inventory.repo")
const RepoProduct = require("../repositories/product.repo")
const DiscountService = require("./discount.service")
const InventoryService = require("./inventory.service")
const { acquireLock } = require("./redis.service")


/* shop order ids [
    {
        shop: id,
        shop_discounts: [],
        shop_products: []
    }
]
*/
class CheckoutService {

    static async checkoutReview({cart_id, userId, shop_order_ids = []}){
        const checkout_order = {
            totalPrice: 0,
            totalDiscount: 0,
            totalPayment: 0
        }, shop_order_ids_new = []
       await Promise.all(shop_order_ids.map( async shop_order => {
            const {shop_id, shop_discounts = [], shop_products = []} = shop_order

            const ProductsCheckedOnServer = await RepoProduct.checkProductByServer(shop_products)
            console.log(ProductsCheckedOnServer, ",e")
            const checkoutPrice = ProductsCheckedOnServer.reduce((acc, product)=>{
                if(!product) throw new BadRequestError("error order")
                return acc + product.price * product.quantity
            }, 0)
            checkout_order.totalPrice += checkoutPrice

            let total_discount = 0
            await Promise.all(shop_discounts.map(async (disc)=>{
               const {discount} =  await DiscountService.getDiscountAmount({userId, shop_id, products: ProductsCheckedOnServer, code: disc.code})
               total_discount += discount;
            }))
            checkout_order.totalDiscount += total_discount
            checkout_order.totalPayment += checkoutPrice - total_discount

            const shopCheckout = {
                shop_id,
                shop_discounts,
                priceRaw: checkoutPrice,
                discountOfShop: total_discount,
                shop_products: ProductsCheckedOnServer
            }
            shop_order_ids_new.push(shopCheckout)

        }))
    return {
        shop_order_ids,
        shop_order_ids_new,
        checkout_order
    }

    
}
    static async processOrder({userId, cart_id ,shop_order_ids, user_address = {}, user_payment = {}}){
        const {shop_order_ids_new, checkout_order} = await CheckoutService.checkoutReview({cart_id, userId, shop_order_ids})
        console.log
        const products = shop_order_ids_new.flatMap(order => order.shop_products)
        for (let i = 0; i < products.length; i++) {
            const {product_id, quantity} = products[i];
            const isEnoughProduct = await acquireLock({product_id, quantity, cart_id})
            console.log(products.slice(0, i), isEnoughProduct)
            if(!isEnoughProduct.modifiedCount) {
                InventoryService.recoverReservationProducts({products: products.slice(0, i), cart_id})
                throw new BadRequestError("meet problem with order! please update cart")
            }
        }
        const newOrder = await order_model.create({
            order_user_id: userId,
            order_checkout: checkout_order,
            order_shipping: user_address,
            order_payment: user_payment,
            order_products: shop_order_ids_new,

        })
        if(!newOrder) throw new BadRequestError("meet problem with order")
        for (let i = 0; i < products.length; i++) {
            const {product_id, quantity} = products[i];
            InventoryRepo.confirmReservation({product_id, quantity, cart_id})
            CartRepo.removeProductInCart({userId, product_id})
        }

        return newOrder
    }
}0

module.exports = CheckoutService 