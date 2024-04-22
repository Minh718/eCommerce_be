const express = require('express')
const { authentication } = require('../../auth/checkAuth')
const { asyncHandlerError } = require('../../utils')
const CartController = require('../../controllers/cart.controller')
const router = express.Router()



router.use(authentication)

router.post('/add', asyncHandlerError(CartController.addToCart))


module.exports = router