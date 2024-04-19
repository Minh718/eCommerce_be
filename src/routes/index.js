'use strict'


const express = require('express')
const router = express.Router()
const {apiKey, validatePermission} = require('../auth/checkAuth')
//middlewares
// router.use(apiKey)
// router.use(validatePermission('0000'))


router.use('/v1/api', require('./auth'))
router.use('/v1/api/product', require('./product'))


module.exports = router