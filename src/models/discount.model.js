'use strict'

const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'Discounts'

// Declare the Schema of the Mongo model
var discountSchema = new mongoose.Schema({
    discount_product_id:{
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Product"
    },
    discount_name:{type: String, required: true},
    discount_description:{type: Number, required:true},
    discount_type: {type: String, default: 'fixed', enum: ["fixed","percent"]},
    discount_value: {type: Number, required: true},
    discount_code:{type: string, required: true},
    discount_start_date:{type: Date, required: true},
    discount_end_date:{type: Date, required: true},
    discount_max_uses:{type: Number, required: true},
    discount_total_uses: {type: Number, required: true},
    discount_user_use: {type: Array, required: true},
    discount_max_per_user: {type: Number, required: true},
    discount_min_order_value: {type: Number, required: true},

    discount_shop_id:{
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Shop"
    },
},
{
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = {
    discount: mongoose.model(DOCUMENT_NAME, discountSchema)
};