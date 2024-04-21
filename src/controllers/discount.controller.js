'use strict'

const DiscountService = require("../services/discount.service")
const { CREATED, OK } = require("../core/success.reponse")

class DiscountController{
    static async createDiscount (req, res, next) {
        new CREATED({
            message: 'create dicount successfully',
            metadata: await DiscountService.createDiscount(
            {...req.body, shop_id: req.user.userId}
            )
        }).send(res)
    }
    static async getAllDiscountsOfShop (req, res, next) {
        new OK({
            message: 'get discounts successfully',
            metadata: await DiscountService.getAllDiscountsOfShop(
            {shop_id: req.user.userId, page: req.params.page}
            )
        }).send(res)
    }
    static async getAllProductsUseCode (req, res, next) {
        new OK({
            message: 'get products for code successfully',
            metadata: await DiscountService.getAllProductsUseCode(
            {page: req.params.page, ...req.body}
            )
        }).send(res)
    }
    static async getDiscountAmount (req, res, next) {
        new OK({
            message: 'get discount of order successfully',
            metadata: await DiscountService.getDiscountAmount(
            {userId: req.user.userId, ...req.body}
            )
        }).send(res)
    }
}

module.exports = DiscountController