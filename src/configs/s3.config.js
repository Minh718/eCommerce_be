'use strict'

const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");


const s3 = new S3Client({
    region: "ap-southeast-1",
    credentials:{
        accessKeyId: process.env.AWS_BUCKET_ACCESS_KEY,
        secretAccessKey: process.env.AWS_BUCKET_SECRET_KEY
    }
})

module.exports = {
    s3,
    PutObjectCommand,
    GetObjectCommand,
    getSignedUrl
}