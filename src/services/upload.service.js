'use strict'

const { result } = require("lodash");
const { s3, PutObjectCommand, GetObjectCommand } = require("../configs/s3.config")
const { getSignedUrl } = require("@aws-sdk/cloudfront-signer");
class UploadService{

    static async uploadImageFromLocal ({
        file
        }){
            try {
                const url_img_publish = 'https://d2m98opkvvt5x6.cloudfront.net/'
                const nameFile =  Date.now() + '-' +file.originalname;
                const command = new PutObjectCommand({
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: nameFile,
                    Body: file.buffer,
                    ContentType: file.mimetype || 'image/jpeg'
                })
                const res = await s3.send(command)

                // const commandGet  = new GetObjectCommand({
                //     Bucket: process.env.AWS_BUCKET_NAME,
                //     Key: nameFile,  
                // })
                // const url = await getSignedUrl(s3, commandGet, {expiresIn: 3600})
                const signedUrl = getSignedUrl({
                    url: url_img_publish + nameFile,
                    keyPairId: process.env.AWS_CLOUDFONT_ID_PUBLIC_KEY,
                    dateLessThan: new Date(Date.now() + 1000*300),
                    privateKey: process.env.AWS_CLOUDFONT_PRIVARY_KEY,
                  });
                return {
                    url: signedUrl,
                    result: res
                }
            } catch (error) {
                
            }
        }
}


module.exports = UploadService