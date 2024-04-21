'use strict'

const { min } = require('lodash');
const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'Discounts'

// Declare the Schema of the Mongo model
var discountSchema = new mongoose.Schema({
    discount_name:{type: String, required: true},
    discount_description:{type: String, required:true},
    discount_type: {type: String, default: 'fixed', enum: ["fixed","percent"]},
    discount_value: {type: Number, required: true},
    discount_code:{type: String, required: true},
    discount_start_date:{type: Date, required: true},
    discount_end_date:{type: Date, required: true},
    discount_max_is_used:{type: Number, required: true},
    discount_total_is_used: {type: Number, required: true},
    discount_list_user_used: {type: Array, default: []}, // [{userId: "111", "times_uses": 1}]
    discount_max_per_user: {type: Number, required: true, min: 1},
    discount_min_for_apply: {type: Number, required: true},
    discount_is_active: {type: Boolean, default: true, required: true},
    discount_apply_domain_product: {type: String, required: true, enum: ["all","specific"]},
    discount_apply_products: {type: Array, required: true},
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