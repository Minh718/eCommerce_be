'use strict'

const ProductFactory = require('../services/product.service.js')
const {CREATED, OK} = require('../core/success.reponse.js')
class ProductController {
    createNewProduct= async (req, res, next) => {
        new CREATED({
            message: 'create product success',
            metadata: await ProductFactory.createProduct(
                req.body.product_type, {...req.body, product_shop: req.user.userId}
            )
        }).send(res)
    }
    findAllDraftsForShop = async (req, res, next) => {
        new OK({
            message: 'find all drafts of shop successfully',
            metadata: await ProductFactory.findAllDraftsForShop(
               req.user.userId
            )
        }).send(res)
    }
    findAllPublishForShop = async (req, res, next) => {
        new OK({
            message: 'find all drafts of shop successfully',
            metadata: await ProductFactory.findAllPublishForShop(
               req.user.userId
            )
        }).send(res)
    }
    publishProductByShop = async (req, res, next) => {
        new OK({
            message: 'publish the product successfully',
            metadata: await ProductFactory.publishProductByShop(
            {
                product_shop: req.user.userId,
                product_id: req.params.id
            }
            )
        }).send(res)
    }
    draftProductByShop = async (req, res, next) => {
        new OK({
            message: 'publish the product successfully',
            metadata: await ProductFactory.draftProductByShop(
            {
                product_shop: req.user.userId,
                product_id: req.params.id
            }
            )
        }).send(res)
    }

    getListSearchProduct = async(req, res, next)=>{
        new OK({
            message: 'get search product successfully',
            metadata: await ProductFactory.searchProducts(req.params.keySearch)
        }).send(res)    
    }
    getDetailProduct = async(req, res, next)=>{
        new OK({
            message: 'get detail product successfully',
            metadata: await ProductFactory.findDetailProduct(req.params.id)
        }).send(res)    
    }
    updateProduct = async(req, res, next)=>{
        console.log(req.user.userId, "meo")
        new OK({
            message: 'update product successfully',
            metadata: await ProductFactory.updateProduct(req.body.product_type, req.params.product_id, req.body, req.user.userId)
        }).send(res)    
    }
    getListAllProductsInPage = async(req, res, next)=>{
        new OK({
            message: 'get list products successfully',
            metadata: await ProductFactory.findAllProducts({page: req.params.page})
        }).send(res)    
    }
}

module.exports = new ProductController()