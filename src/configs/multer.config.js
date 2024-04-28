'use strict'

const multer = require("multer")

const uploadMemody = multer({
    storage: multer.memoryStorage()
})



const uploadDisk = multer({
    storage: multer.diskStorage({
        destination: function(req, file, cb){
            cb(null, './src/uploads')
        },
        filename: function(req, file, cb){
            const newName = Date.now() + '-' + file.originalname
            cb(null, newName)
        }
    })
})

module.exports = {
    uploadDisk,
    uploadMemody
}