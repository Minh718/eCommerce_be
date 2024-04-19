'use strict'

const apiKeyModel = require("../models/apiKey.model")

const apiKeyFindById = async (key)=>{
    try {
        const apiKey = await apiKeyModel.findOne({key, status: true}).lean()
        return apiKey
    } catch (error) {
        return {
            error
        }
    }
}

module.exports = {
    apiKeyFindById
}