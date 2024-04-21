const express = require('express')
const { authentication } = require('../../auth/checkAuth')
const { asyncHandlerError } = require('../../utils')
const DiscountController = require('../../controllers/discount.controller')
const router = express.Router()



router.use(authentication)

router.post('/create', asyncHandlerError(DiscountController.createDiscount))
router.post('/amount', asyncHandlerError(DiscountController.getDiscountAmount))
router.get('/all/:page', asyncHandlerError(DiscountController.getAllDiscountsOfShop))
router.get('/products/:page', asyncHandlerError(DiscountController.getAllProductsUseCode))


module.exports = router