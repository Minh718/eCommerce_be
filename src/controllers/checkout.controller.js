'use strict'

const { OK } = require("../core/success.reponse")
const CheckoutService = require("../services/checkout.service")


class CheckoutController {
    static async checkoutReview(req, res, next){
        return new OK({message: "sucessfully",
        metadata: await CheckoutService.checkoutReview({...req.body, userId: req.user.userId})
    }).send(res)
    }
    static async processOrder(req, res, next){
        return new OK({message: "sucessfully",
        metadata: await CheckoutService.processOrder({...req.body, userId: req.user.userId})
    }).send(res)
    }

}

module.exports = CheckoutController