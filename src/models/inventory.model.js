'use strict'

const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Inventory'
const COLLECTION_NAME = 'Inventories'

// Declare the Schema of the Mongo model
var inventorySchema = new mongoose.Schema({
    inventory_product_id:{
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Product"
    },
    inventory_location:{
        type: String,
        default: ""
    },
    inventory_stock:{
        type: Number,
        required:true,
    },
    inventory_shop_id:{
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Shop"
    },
    inventory_reservations: {
        type: Array,
        default: []
    }
},
{
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = {
    inventory: mongoose.model(DOCUMENT_NAME, inventorySchema)};