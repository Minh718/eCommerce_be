'use strict'

const {ReasonPhrases, StatusCodes} = require("../utils/httpStatusCode")

class ErrorMessage extends Error {
    constructor(message, status){
        super(message)
        this.status = status
    }
}


class ConflictRequestError extends ErrorMessage {
    constructor(message=ReasonPhrases.CONFLICT, status=StatusCodes.CONFLICT){
        super(message, status)
    }
}

class AuthFailureError extends ErrorMessage {
    constructor(message= ReasonPhrases.UNAUTHORIZED, status=StatusCodes.UNAUTHORIZED){
        super(message, status)
    }
}
class BadRequestError extends ErrorMessage {
    constructor(message= ReasonPhrases.BAD_REQUEST, status=StatusCodes.BAD_REQUEST){
        super(message , status)
    }
}
class NotFoundError extends ErrorMessage {
    constructor(message= ReasonPhrases.NOT_FOUND, status=StatusCodes.NOT_FOUND){
        super(message , status)
    }
}
module.exports = {
    NotFoundError,
    ConflictRequestError,
    BadRequestError,
    AuthFailureError
}