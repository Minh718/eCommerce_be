'use strict'

const { BadRequestError } = require("../core/error.response");


const checkValidDiscount = (discount)=>{
    const {discount_start_date, discount_end_date, discount_max_is_used,
        discount_total_is_used,discount_is_active
    } = discount;

    if(new Date() < new Date(discount_start_date)) throw new BadRequestError(`the discount code can be used from ${discount_start_date}`)
    if(new Date() > new Date(discount_end_date) || !discount_is_active) throw new BadRequestError(`the discount code has expired`)
    if(discount_max_is_used <= discount_total_is_used) throw new BadRequestError(`The discount code has been used up`)

}

module.exports = {checkValidDiscount}