'use strict'

const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Order'
const COLLECTION_NAME = 'Orders'

// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema({
    order_user_id:{type: mongoose.Schema.Types.ObjectId,required: true ,ref: "Shop"}, 
    order_checkout:{type: Object, required: true}, 
    order_shipping:{type: Object, default: {}}, // address
    order_payment: {type: Object, default: {}},
    order_products: {type: Array, required: true},
    order_trackingNumber: {type: String, default: ""},
    order_status: {type: String, default: "pending" ,enum: ["pending", "confirmed", "shipping", "shiped" ,"canceled"]}

},
{
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = {
    order_model: mongoose.model(DOCUMENT_NAME, cartSchema)
};