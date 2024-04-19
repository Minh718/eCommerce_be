'use strict'

const { response } = require("express")
const { CREATED, OK } = require("../core/success.reponse")
const AuthService = require("../services/auth.service")

class AuthController {
    handlerRefreshToken = async(req, res, next)=>{
        return new OK({
            message: "getTokenSuccess",
            metadata: await AuthService.handlerRefreshToken({user: req.user, keyStore: req.keyStore, refreshToken: req.refreshToken})
        }).send(res)
    }
    logout = async (req, res, next) => {
            return new OK({
                message: await AuthService.logout(req.keyStore)
            }).send(res)
    }
    login = async (req, res, next) =>{
        return new OK({
            message: "Login Success",
            metadata: await AuthService.login(req.body)
        }).send(res)
    }
    signUp = async (req, res, next) =>{
        console.log("??")
            return new CREATED({
                message: "Registered Success",
                metadata: await AuthService.signUp(req.body)
            }).send(res)
    }
}

module.exports = new AuthController()