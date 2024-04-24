'use strict'

const { BadRequestError } = require("../core/error.response")
const RepoProduct = require("../repositories/product.repo.js")

const {product, clothing, electronic} = require('../models/product.model.js')
const { removeNullObject, parserNestedObject } = require("../utils/index.js")
const InventoryRepo = require("../repositories/inventory.repo.js")

class ProductFactory {
    static productRegister = {}

    static registerProductType = (type, classRef)=>{
        ProductFactory.productRegister[type] = classRef
    }
    static async createProduct(type, payload) {
        const classProduct = ProductFactory.productRegister[type]

        if(!classProduct) throw new BadRequestError(`invalid with type: ${type}`)
        return new classProduct(payload).createProduct()
    }
    static async publishProductByShop({product_shop, product_id}){
        return await RepoProduct.publishProductByShop({product_shop, product_id})
    }
    static async draftProductByShop({product_shop, product_id}){
        return await RepoProduct.draftProductByShop({product_shop, product_id})
    }
    static async findAllDraftsForShop(product_shop, limit = 50, skip = 0){
        const query = {product_shop, isDraft: true }
        return await RepoProduct.findAllDraftsForShop({query, limit, skip})
    }
    static async findAllPublishForShop(product_shop, limit = 50, skip = 0){
        const query = {product_shop, isPublish: true }
        return await RepoProduct.findAllPublishForShop({query, limit, skip})
    }

    static async searchProducts(keySearch){
        return await RepoProduct.searchProducts(keySearch)
    }

    static async findDetailProduct(product_id){
        return await RepoProduct.findDetailProduct({product_id, unSelect: ["__v", "createdAt"]})
    }

    static async findAllProducts({limit = 50, sort = 'ctime', page = 1, filter = {isPublish: true}}){
        return await RepoProduct.findAllProducts({limit, sort, page, filter, select: [
            'product_name',
            'product_price',
            'product_thump'
        ]})
    }

    static async updateProduct(type, product_id, payload, userId){
        const classProduct = ProductFactory.productRegister[type]
        if(!classProduct) throw new BadRequestError(`invalid with type: ${type}`)
        return new classProduct(payload).updateProduct(product_id, userId)
    } 
}

class Product {
    constructor({
        product_name, product_thump, product_description,product_attributes,
        product_type, product_price, product_quantity, product_shop, 
    }){
        this.product_name = product_name,
        this.product_thump = product_thump
        this.product_description = product_description
        this.product_type = product_type
        this.product_price = product_price
        this.product_quantity = product_quantity
        this.product_shop = product_shop
        this.product_attributes = product_attributes
    }
    async createProduct (id) {
        const newProduct = await product.create({...this, _id: id}) 
        if(!newProduct) throw new BadRequestError("create product error")
        const newInventory = await InventoryRepo.insertInventory({product_id: newProduct._id, 
            shop_id: newProduct.product_shop,
            stock: newProduct.product_quantity,
        })
        if(!newInventory) throw new BadRequestError("create inventory error")
        return newProduct
        
    }


    async updateProduct(product_id, payload, userId){
        const upProduct =  await RepoProduct.updateProductById({product_id, payload,userId, model: product})
        if(!upProduct) throw new BadRequestError("update product error")
        return upProduct
    }
}


class Clothing extends Product{
    async createProduct(){
        const newClothing = await clothing.create({...this.product_attributes, product_shop: this.product_shop})
        if(!newClothing) throw new BadRequestError("create Clothing error")
        const newProduct = await super.createProduct(newClothing._id)
        if(!newProduct) throw new BadRequestError("create product error")
        return newProduct
    }
    async updateProduct(product_id, userId){
        //remove null attribute of object

        const noneNullObject = removeNullObject(this)
        if(noneNullObject.product_attributes){
            const NonNullClothing = removeNullObject(removeNullObject(parserNestedObject(noneNullObject.product_attributes)))
            const upProduct = await RepoProduct.updateProductById({product_id, NonNullClothing, userId, model: clothing})
            if(!upProduct) throw new BadRequestError("update product error")
        }
        return await super.updateProduct(product_id, removeNullObject(parserNestedObject(noneNullObject)), userId)
        
    }
}
class Electronic extends Product{
    async createProduct(){
        const newElectronic = await electronic.create({...this.product_attributes, product_shop: this.product_shop})
        if(!newElectronic) throw new BadRequestError("create Clothing error")
        const newProduct = await super.createProduct(newElectronic._id)
        if(!newProduct) throw new BadRequestError("create product error")
        return newProduct
    }
    async updateProduct(product_id, userId){
        //remove null attribute of object
        const noneNullObject = removeNullObject(this)
        if(noneNullObject.product_attributes){
            const NonNullElectronic = removeNullObject(removeNullObject(parserNestedObject(noneNullObject.product_attributes)))
            const upProduct = await RepoProduct.updateProductById({product_id, NonNullElectronic, userId, model: electronic})
           console.log(upProduct, "meomeo")
            if(!upProduct) throw new BadRequestError("update product error")

        }
        return await super.updateProduct(product_id, removeNullObject(parserNestedObject(noneNullObject)), userId)
        
    }
}



ProductFactory.registerProductType("Clothing", Clothing)
ProductFactory.registerProductType("Electronic", Electronic)

module.exports = ProductFactory