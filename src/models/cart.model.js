'use strict'

const { min } = require('lodash');
const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Cart'
const COLLECTION_NAME = 'Carts'

// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema({
    cart_products:{type: array, default: []},
    cart_count_product:{type: String, required:true},
    cart_user_id:{
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
    cart: mongoose.model(DOCUMENT_NAME, cartSchema)
};