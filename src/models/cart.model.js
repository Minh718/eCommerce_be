'use strict'

const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Cart'
const COLLECTION_NAME = 'Carts'

// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema({
    cart_products:{type: Array, default: []}, 
    //[{product_id, quatity, price, name, shop_id}]
    cart_count_product:{type: Number, required:true, default: 0},
    cart_user_id:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: "Shop"
    },
},
{
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = {
    cart_model: mongoose.model(DOCUMENT_NAME, cartSchema)
};