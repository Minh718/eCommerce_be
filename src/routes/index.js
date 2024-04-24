'use strict'


const express = require('express')
const router = express.Router()
const {apiKey, validatePermission} = require('../auth/checkAuth')
//middlewares
// router.use(apiKey)
// router.use(validatePermission('0000'))


router.use('/v1/api/checkout', require('./checkout'))
router.use('/v1/api/product', require('./product'))
router.use('/v1/api/discount', require('./discount'))
router.use('/v1/api/cart', require('./cart'))
router.use('/v1/api', require('./auth'))


module.exports = router