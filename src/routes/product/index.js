'use strict'


const express = require('express')
const productController = require('../../controllers/product.controller')
const { authentication } = require('../../auth/checkAuth')
const { asyncHandlerError } = require('../../utils')
const router = express.Router()

router.get('/search/:keySearch', asyncHandlerError(productController.getListSearchProduct))

router.get('/:page', asyncHandlerError(productController.getListAllProductsInPage))

router.get('/detail/:id', asyncHandlerError(productController.getDetailProduct))


router.use(authentication)

router.patch('/update/:product_id', asyncHandlerError(productController.updateProduct))

router.get('/drafts/all', asyncHandlerError(productController.findAllDraftsForShop))

router.get('/publish/all', asyncHandlerError(productController.findAllPublishForShop))

router.get('/publish/:id', asyncHandlerError(productController.publishProductByShop))

router.get('/draft/:id', asyncHandlerError(productController.draftProductByShop))

router.post('', asyncHandlerError(productController.createNewProduct))
module.exports = router