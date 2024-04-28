const express = require('express')
const { authentication } = require('../../auth/checkAuth')
const { asyncHandlerError } = require('../../utils')
const UploadController = require('../../controllers/upload.controller')
const { uploadDisk, uploadMemody } = require('../../configs/multer.config')
const router = express.Router()



router.use(authentication)

router.post('/productS3', uploadMemody.single('file') ,asyncHandlerError(UploadController.uploadImageFromLocal))


module.exports = router