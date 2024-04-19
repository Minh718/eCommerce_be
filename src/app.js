require('dotenv').config()
const compression = require('compression');
const express = require('express');
const { default: helmet } = require('helmet');
const morgan = require('morgan');
const router = require('./routes');

const app =   express();


// middlewares
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// db
require('./dbs/init.mongodb')


// routes
app.use('', router)


//handle errors
app.use((req, res, next)=>{
    const error = new Error('Not found route')
    error.status = 404
    next(error)
})

app.use((error ,req, res, next)=>{
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        stack: error.stack,
        message: error.message || 'Internal Server error'
    })
})

module.exports = app; 