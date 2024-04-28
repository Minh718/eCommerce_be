'use strict'

const { BadRequestError } = require("../core/error.response");
const { OK } = require("../core/success.reponse");
const UploadService = require("../services/upload.service");


class UploadController {
    static async uploadImageFromLocal(req, res, next){
        const {file} = req
        if(!file) throw new BadRequestError("file missed") 
        return new OK({message: "upload image successfully",
        metadata: await UploadService.uploadImageFromLocal({file})
    }).send(res)
    }

}

module.exports = UploadController;