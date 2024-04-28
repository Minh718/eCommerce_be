'use strict'

const { s3, PutObjectCommand } = require("../configs/s3.config")

class UploadService{

    static async uploadImageFromLocal ({
        file
        }){
            try {
                const command = new PutObjectCommand({
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: Date.now() + '-' +file.originalname,
                    Body: file.buffer,
                    ContentType: file.mimetype || 'image/jpeg'
                })
                const res = await s3.send(command)
                return res
            } catch (error) {
                
            }
        }
}


module.exports = UploadService