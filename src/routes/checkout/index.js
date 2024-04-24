'use strict'


const express = require('express')
const { authentication } = require('../../auth/checkAuth')
const { asyncHandlerError } = require('../../utils')
const CheckoutController = require('../../controllers/checkout.controller')
const router = express.Router()



router.use(authentication)

router.post('/order', asyncHandlerError(CheckoutController.processOrder))
router.post('/', asyncHandlerError(CheckoutController.checkoutReview))


module.exports = router