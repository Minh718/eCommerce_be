const { Types } = require('mongoose')
const {product, clothing, electronic} = require('../models/product.model.js')
const { getSelectData, getUnSelectData } = require('../utils/index.js')
class RepoProduct {

    static async findAllDraftsForShop({query, limit, skip}){
        return await RepoProduct.queryProduct({query, limit, skip})
    }
    static async findAllPublishForShop ({query, limit, skip}){
            return await RepoProduct.queryProduct({query, limit, skip})
    }

    static async queryProduct ({query, limit, skip}){
        return await product.find(query).populate('product_shop', 'name email -_id').sort({updateAt: -1})
        .skip(skip).limit(limit).lean()
    }

    static async findAllProducts ({limit, sort, page, filter, select}){
        const skip = (page-1)*limit
        const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1}
        const products = await product.find(filter).sort(sortBy)
        .skip(skip).limit(limit).select(getSelectData(select)).lean()
        return products

        //// continue
    } 

    static async updateProductById({product_id, payload, model , userId, isNew = true}){
            return await model.findOneAndUpdate({
                _id: product_id,
                product_shop: userId
            }, payload, {new: isNew})
    }
    static async findDetailProduct({product_id, unSelect}){
        return product.findById(product_id).select(getUnSelectData(unSelect))
    }

    static async searchProducts (keySearch){
        const regexSearch = new RegExp(keySearch)
        const results = await product.find({
            isPublish: true,
            $text: {$search: regexSearch},
        }, {score: {$meta: 'textScore'}}).sort({score: {$meta: 'textScore'}}).lean()
        // }).sort((fi, si) => si.score - fi.score)
        // }).sort({score: {$meta: 'textScore'}})
        return results
    }
    static async publishProductByShop ({product_shop, product_id}){
        // const foundShop = await product.findOne({
        //     product_shop: new Types.ObjectId(product_shop),
        //     _id:  new Types.ObjectId(product_id)
        // })
        // if (!foundShop) return null
        // foundShop.isDraft = false
        // foundShop.isPublish = true

        // const {isUpdate} = await foundShop.update()
        // return isUpdate;
        const foundShop = await product.findOneAndUpdate(
            {
                product_shop: new Types.ObjectId(product_shop),
                _id:  new Types.ObjectId(product_id)
            },
            { isDraft: false,
            isPublish: true 
        }, // Dữ liệu cập nhật
            { new: true } // Tùy chọn: Trả về bản ghi đã cập nhật (mặc định là bản ghi cũ)
        );
        return foundShop
    }
    static async draftProductByShop ({product_shop, product_id}){
        // const foundShop = await product.findOne({
        //     product_shop: new Types.ObjectId(product_shop),
        //     _id:  new Types.ObjectId(product_id)
        // })
        // if (!foundShop) return null
        // foundShop.isDraft = false
        // foundShop.isPublish = true

        // const {isUpdate} = await foundShop.update()
        // return isUpdate;
        const foundShop = await product.findOneAndUpdate(
            {
                product_shop: new Types.ObjectId(product_shop),
                _id:  new Types.ObjectId(product_id)
            },
            { isDraft: true,
            isPublish: false 
        }, // Dữ liệu cập nhật
            { new: true } // Tùy chọn: Trả về bản ghi đã cập nhật (mặc định là bản ghi cũ)
        );
        return foundShop
    }
}
module.exports = RepoProduct