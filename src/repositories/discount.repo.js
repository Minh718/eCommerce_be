'use strict'

const { discount } = require("../models/discount.model")
const { getUnSelectData } = require("../utils")

class DiscountRepo{
    static async findDiscountOfShopByCode({code, shop_id}){
        return await discount.findOne({discount_code: code, discount_shop_id: shop_id})
    }
    static async createDiscount(payload){
        const {name, description, type, value, code, start_date, end_date,
            max_is_used, total_is_used, max_per_user, min_for_apply, is_active = true
            , apply_domain_product,apply_products, shop_id}
             = payload
        return await discount.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_value: value,
            discount_code: code,
            discount_start_date: start_date,
            discount_end_date: end_date,
            discount_max_is_used: max_is_used,
            discount_total_is_used: total_is_used,
            discount_max_per_user: max_per_user,
            discount_min_for_apply: min_for_apply,
            discount_is_active: is_active,
            discount_apply_domain_product: apply_domain_product,
            discount_apply_products: apply_products,
            discount_shop_id: shop_id,
        })
    }
    static async getAllDiscountsOfShopUnselect({limit, sort, page, filter, unSelect}){
        const skip = (page-1)*limit
        const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1}
        return await discount.find(filter).sort(sortBy)
        .skip(skip).limit(limit).select(getUnSelectData(unSelect)).lean()
    }
}

module.exports = DiscountRepo