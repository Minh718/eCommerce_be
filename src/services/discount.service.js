const DiscountRepo = require("../repositories/discount.repo")
const ProductRepo = require("../repositories/product.repo")
const {BadRequestError} = require("../core/error.response")
const { trusted } = require("mongoose")
const { checkValidDiscount } = require("../utils/discount-utils")

class DiscountService {
    static async createDiscount(payload){
         const holderDiscount = await DiscountRepo.findDiscountOfShopByCode({code: payload.code, shop_id: payload.shop_id}) 
        if(holderDiscount) throw new BadRequestError("the discount existed")
        const newDiscount = await DiscountRepo.createDiscount(payload)
        if(!newDiscount) throw new BadRequestError("error discount creation")
        return newDiscount
        
    }

    static async getAllProductsUseCode({code, shop_id,limit = 10 ,page}){
        const holderDiscount = await DiscountRepo.findDiscountOfShopByCode({code, shop_id}) 
        if(!holderDiscount || !holderDiscount.discount_is_active) 
        throw new BadRequestError("the discount is happened with wrong")
        let products;
        if(holderDiscount.discount_apply_domain_product === 'all'){
            products = await ProductRepo.findAllProducts(
            {filter: {
                product_shop: shop_id,
                isPublish: true
            }, 
            sort: 'ctime',
            page,
            limit, 
            select: ['product_name']}
            )
        }else{
            console.log(holderDiscount, "LKK")
            products = await ProductRepo.findAllProducts(
                {filter: {
                    _id: {$in: holderDiscount.discount_apply_products},
                    isPublish: true
                },
                    sort: 'ctime',
                    page,
                    limit, 
                    select: ['product_name']}
                )
        }
        return products
    }

    static async getAllDiscountsOfShop({shop_id, page, limit=20}){
        const discounts = await DiscountRepo.getAllDiscountsOfShopUnselect({
            limit: +limit,
            page: +page,
            sort: 'ctime',
            filter: {
                discount_shop_id: shop_id
            },
            unSelect: ['__v']
        })
        if(!discounts) throw new BadRequestError("error get discounts")
        return discounts

    }
    static async getDiscountAmount({userId, shop_id, products, code}){
        const holderDiscount = await DiscountRepo.findDiscountOfShopByCode({shop_id, code})
        // console.log(holderDiscount)
        if(!holderDiscount) throw new BadRequestError("the discount not existed")
        checkValidDiscount(holderDiscount)
        const {discount_apply_domain_product, discount_apply_products,
            discount_min_for_apply, discount_type, discount_max_per_user,
            discount_list_user_used, discount_value} = holderDiscount
        let total_price = 0

        const user = discount_list_user_used.find(user=> user.userId === userId)
        if(user && user.times_uses >= discount_max_per_user)  throw new BadRequestError("You have used up discount")

        if(discount_apply_domain_product === 'all'){
            total_price = products.reduce((acc, product) => {
                return acc + (product.price*product.quantity)
            }, 0)
        }else{
            total_price = products.reduce((acc, product) => {
                return discount_apply_products.includes(product.product_id)
                ? acc + (product.price*product.quantity)
                :acc
            }, 0)
        }
        if(discount_min_for_apply > total_price) throw new BadRequestError("price of products is short (thấp) to apply discount")

        
       const amount =  discount_type === "fixed" ? discount_value : total_price*(discount_value/100)

        
        return {
            total_price,
            discount: amount,
            finalPrice: total_price - amount
        }
    }

}

module.exports = DiscountService