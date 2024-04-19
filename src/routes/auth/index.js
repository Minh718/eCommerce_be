'use strict'


const express = require('express')
const authController = require('../../controllers/auth.controller')
const { asyncHandlerError } = require('../../utils')
const { authentication } = require('../../auth/checkAuth')
const router = express.Router()
    
router.post('/shop/signup', asyncHandlerError(authController.signUp))
router.post('/shop/login', asyncHandlerError(authController.login))

// router.use(authentication)

router.post('/shop/logout' ,asyncHandlerError(authController.logout))
router.post('/shop/refreshtoken' ,asyncHandlerError(authController.handlerRefreshToken))



module.exports = router